'use client'
import { useState, useEffect, useRef } from 'react'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { DotenvConfig } from '@/config/env.config'
import { Edit2, Trash2, Plus, GripVertical, X, ChevronDown } from 'lucide-react'
import { Modal } from '../../../../ui/molecules/UserModal'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import Image from 'next/image'
import { Button } from '@/ui/shadcn/button'

export default function CollegeRankingsPage() {
  const { setHeading } = usePageHeading()
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteProgramId, setDeleteProgramId] = useState(null)
  const [editingProgramId, setEditingProgramId] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [draggedItem, setDraggedItem] = useState(null)
  const [draggedProgram, setDraggedProgram] = useState(null)
  const [programs, setPrograms] = useState([])
  const [colleges, setColleges] = useState([])
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [collegeSearch, setCollegeSearch] = useState('')
  const [programSearch, setProgramSearch] = useState('')
  const [showProgramDropdown, setShowProgramDropdown] = useState(false)
  const programDropdownRef = useRef(null)

  const fetchRankings = async () => {
    setLoading(true)
    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/college-ranking?limit=100`
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // Handle both direct array and items array format
      if (Array.isArray(data)) {
        setRankings(data)
      } else if (data.items && Array.isArray(data.items)) {
        setRankings(data.items)
      } else {
        setRankings([])
      }
    } catch (error) {
      toast.error('Failed to fetch rankings')
      console.error(error)
      setRankings([])
    } finally {
      setLoading(false)
    }
  }

  const fetchPrograms = async () => {
    try {
      // Fetch all programs without limit
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/program?limit=1000`
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setPrograms(Array.isArray(data.items) ? data.items : [])
    } catch (error) {
      console.error('Failed to fetch programs:', error)
      setPrograms([])
    }
  }

  const fetchColleges = async (search = '') => {
    try {
      // Only fetch if a program is selected
      if (!selectedProgram) {
        setColleges([])
        return
      }

      // Build URL with program_id filter to only get colleges offering this program
      const baseUrl = `${DotenvConfig.NEXT_APP_API_BASE_URL}/college`
      const params = new URLSearchParams({
        program_id: selectedProgram.id.toString(),
        limit: '100'
      })

      if (search) {
        params.append('q', search)
      }

      const url = `${baseUrl}?${params.toString()}`
      const response = await authFetch(url)
      const data = await response.json()
      setColleges(data.items || [])
    } catch (error) {
      console.error('Failed to fetch colleges:', error)
      setColleges([])
    }
  }

  useEffect(() => {
    setHeading('College Rankings')
    fetchRankings()
    fetchPrograms()
    return () => setHeading(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDeleteProgram = async () => {
    if (!deleteProgramId) return

    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/college-ranking/program?program_id=${deleteProgramId}`,
        { method: 'DELETE' }
      )
      await response.json()
      toast.success('Rankings deleted successfully')
      fetchRankings()
    } catch (error) {
      toast.error('Failed to delete rankings')
    } finally {
      setIsDialogOpen(false)
      setDeleteProgramId(null)
    }
  }

  const handleDragStart = (e, ranking, programId) => {
    setDraggedItem({ ranking, programId })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, targetRanking, programId) => {
    e.preventDefault()
    if (!draggedItem || draggedItem.programId !== programId) return

    const programRankings = rankings.find((r) => r.program?.id === programId)
    if (!programRankings) return

    const items = [...programRankings.rankings]
    const draggedIndex = items.findIndex((r) => r.id === draggedItem.ranking.id)
    const targetIndex = items.findIndex((r) => r.id === targetRanking.id)

    if (draggedIndex === -1 || targetIndex === -1) return

    // Reorder array
    const [removed] = items.splice(draggedIndex, 1)
    items.splice(targetIndex, 0, removed)

    // Update ranks
    const updatedRankings = items.map((item, index) => ({
      id: item.id,
      rank: index + 1
    }))

    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/college-ranking/order`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            program_id: programId,
            rankings: updatedRankings
          })
        }
      )
      await response.json()
      toast.success('Ranking order updated')
      fetchRankings()
    } catch (error) {
      toast.error('Failed to update ranking order')
    } finally {
      setDraggedItem(null)
    }
  }

  const handleProgramDragStart = (e, programGroup) => {
    setDraggedProgram(programGroup)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleProgramDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleProgramDrop = async (e, targetProgramGroup) => {
    e.preventDefault()
    if (
      !draggedProgram ||
      draggedProgram.program?.id === targetProgramGroup.program?.id
    ) {
      setDraggedProgram(null)
      return
    }

    const items = [...rankings]
    const draggedIndex = items.findIndex(
      (r) => r.program?.id === draggedProgram.program?.id
    )
    const targetIndex = items.findIndex(
      (r) => r.program?.id === targetProgramGroup.program?.id
    )

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedProgram(null)
      return
    }

    // Reorder array
    const [removed] = items.splice(draggedIndex, 1)
    items.splice(targetIndex, 0, removed)

    // Update program orders
    const updatedProgramOrders = items.map((item, index) => ({
      program_id: item.program?.id,
      program_list_order: index + 1
    }))

    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/college-ranking/program-order`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            programOrders: updatedProgramOrders
          })
        }
      )
      await response.json()
      toast.success('Program order updated')
      fetchRankings()
    } catch (error) {
      toast.error('Failed to update program order')
    } finally {
      setDraggedProgram(null)
    }
  }

  const handleAddRanking = async () => {
    if (!selectedProgram || !selectedCollege) {
      toast.error('Please select both program and college')
      return
    }

    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/college-ranking`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            program_id: selectedProgram.id,
            college_id: selectedCollege.id
          })
        }
      )
      await response.json()
      toast.success('College added to ranking successfully')
      fetchRankings()
      // Keep modal open and clear only college selection so user can add more colleges
      setSelectedCollege(null)
      setCollegeSearch('')
    } catch (error) {
      toast.error(error.message || 'Failed to add ranking')
    }
  }

  const handleOpenEditModal = (program) => {
    setEditingProgramId(program.id)
    setSelectedProgram(program)
    setSelectedCollege(null)
    setCollegeSearch('')
    setProgramSearch(program.title || '')
    setShowProgramDropdown(false)
    setIsEditModalOpen(true)
    // Colleges will be fetched automatically via useEffect when selectedProgram is set
  }

  const handleDeleteRanking = async (rankingId) => {
    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/college-ranking?ranking_id=${rankingId}`,
        { method: 'DELETE' }
      )
      await response.json()
      toast.success('Ranking deleted successfully')
      fetchRankings()
    } catch (error) {
      toast.error('Failed to delete ranking')
    }
  }

  useEffect(() => {
    // Only fetch colleges if a program is selected
    if (selectedProgram) {
      if (collegeSearch) {
        const timeoutId = setTimeout(() => {
          fetchColleges(collegeSearch)
        }, 300)
        return () => clearTimeout(timeoutId)
      } else {
        fetchColleges()
      }
    } else {
      setColleges([])
    }
  }, [collegeSearch, selectedProgram])

  // Close program dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        programDropdownRef.current &&
        !programDropdownRef.current.contains(event.target)
      ) {
        setShowProgramDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  return (
    <>
      <div className='p-4 w-full'>
        <div className='flex justify-end items-center mb-6'>
          <Button
            onClick={() => {
              setSelectedProgram(null)
              setSelectedCollege(null)
              setCollegeSearch('')
              setProgramSearch('')
              setShowProgramDropdown(false)
              setIsEditModalOpen(true)
            }}
          >
            <Plus size={20} />
            Add Ranking
          </Button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array.isArray(rankings) &&
            rankings.length > 0 &&
            rankings.map((programGroup, programIndex) => {
              if (!programGroup || !programGroup.program) return null
              return (
                <div
                  key={programGroup.program?.id}
                  draggable
                  onDragStart={(e) => handleProgramDragStart(e, programGroup)}
                  onDragOver={handleProgramDragOver}
                  onDrop={(e) => handleProgramDrop(e, programGroup)}
                  className='bg-white rounded-lg shadow-md p-6 border border-gray-200 cursor-move hover:shadow-lg transition-shadow'
                >
                  <div className='flex justify-between items-start mb-4'>
                    <div className='flex items-center gap-2'>
                      <GripVertical className='text-gray-400' size={20} />
                      <h2 className='text-xl font-semibold text-gray-800'>
                        {programGroup.program?.title || 'Unknown Program'}
                      </h2>
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() =>
                          handleOpenEditModal(programGroup.program)
                        }
                        className='p-2 text-blue-600 hover:bg-blue-50 rounded'
                        title='Edit'
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteProgramId(programGroup.program?.id)
                          setIsDialogOpen(true)
                        }}
                        className='p-2 text-red-600 hover:bg-red-50 rounded'
                        title='Delete'
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    {programGroup.rankings?.map((ranking, index) => (
                      <div
                        key={ranking.id}
                        draggable
                        onDragStart={(e) =>
                          handleDragStart(e, ranking, programGroup.program?.id)
                        }
                        onDragOver={handleDragOver}
                        onDrop={(e) =>
                          handleDrop(e, ranking, programGroup.program?.id)
                        }
                        className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-move border border-gray-200'
                      >
                        <GripVertical className='text-gray-400' size={20} />
                        <span className='font-bold text-blue-600 w-8'>
                          #{ranking.rank}
                        </span>
                        <div className='flex-1 flex items-center gap-3'>
                          {ranking.college?.college_logo && (
                            <div className='relative w-10 h-10 rounded-full overflow-hidden'>
                              <Image
                                src={ranking.college.college_logo}
                                alt={ranking.college.name}
                                fill
                                className='object-cover'
                              />
                            </div>
                          )}
                          <span className='text-sm font-medium text-gray-700'>
                            {ranking.college?.name || 'Unknown College'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteRanking(ranking.id)}
                          className='p-1 text-red-600 hover:bg-red-100 rounded'
                          title='Delete'
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    {!programGroup.rankings?.length && (
                      <p className='text-gray-500 text-sm text-center py-4'>
                        No rankings yet
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
        </div>

        {(!Array.isArray(rankings) || rankings.length === 0) && (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>No rankings found</p>
            <p className='text-gray-400 text-sm mt-2'>
              Click "Add Ranking" to create your first ranking
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Ranking Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingProgramId(null)
          setSelectedProgram(null)
          setSelectedCollege(null)
          setCollegeSearch('')
          setProgramSearch('')
          setShowProgramDropdown(false)
        }}
        title={
          selectedProgram
            ? `Add Colleges to ${selectedProgram?.title || 'Program'}`
            : 'Select Program to Add Rankings'
        }
        className='max-w-2xl'
      >
        <div className='p-6 space-y-6'>
          {/* Program Selection */}
          <div className='relative' ref={programDropdownRef}>
            <label className='block mb-2 font-medium'>
              Program <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <input
                type='text'
                value={programSearch}
                onChange={(e) => {
                  const value = e.target.value
                  setProgramSearch(value)
                  setShowProgramDropdown(true)
                  // Clear selection if user is typing something different from selected program
                  if (selectedProgram && value !== selectedProgram.title) {
                    setSelectedProgram(null)
                  }
                  if (!value) {
                    setSelectedProgram(null)
                  }
                }}
                onFocus={() => {
                  if (!editingProgramId) {
                    setShowProgramDropdown(true)
                  }
                }}
                placeholder='Search programs...'
                className='w-full p-2 pr-10 border rounded'
                disabled={!!editingProgramId}
              />
              <button
                type='button'
                onClick={() => {
                  if (!editingProgramId) {
                    setShowProgramDropdown(!showProgramDropdown)
                  }
                }}
                disabled={!!editingProgramId}
                className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50'
              >
                <ChevronDown
                  size={20}
                  className={`transition-transform ${
                    showProgramDropdown ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
            {showProgramDropdown && !editingProgramId && (
              <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto'>
                {(() => {
                  // Get program IDs that already have rankings (only when not editing)
                  const programsWithRankings = editingProgramId
                    ? []
                    : rankings.map((group) => group.program?.id).filter(Boolean)

                  // Filter programs: exclude those with rankings (unless editing that program)
                  const availablePrograms = programs.filter((program) => {
                    const hasRanking = programsWithRankings.includes(program.id)
                    // When editing, show the current program even if it has rankings
                    if (editingProgramId && program.id === editingProgramId) {
                      return true
                    }
                    // When not editing, exclude programs that already have rankings
                    return !hasRanking
                  })

                  // Apply search filter and exclude selected program
                  const filteredPrograms = availablePrograms.filter(
                    (program) => {
                      const matchesSearch = program.title
                        ?.toLowerCase()
                        .includes(programSearch.toLowerCase())
                      // Exclude the selected program from the dropdown list
                      const isNotSelected =
                        !selectedProgram || program.id !== selectedProgram.id
                      return matchesSearch && isNotSelected
                    }
                  )

                  if (filteredPrograms.length === 0) {
                    return (
                      <div className='p-3 text-gray-500 text-sm text-center'>
                        {programSearch
                          ? 'No programs found'
                          : 'Start typing to search programs...'}
                      </div>
                    )
                  }

                  return filteredPrograms.map((program) => (
                    <div
                      key={program.id}
                      onClick={() => {
                        setSelectedProgram(program)
                        setProgramSearch(program.title || '')
                        setShowProgramDropdown(false)
                      }}
                      className='p-3 cursor-pointer hover:bg-gray-100 transition-colors'
                    >
                      <span className='text-sm'>{program.title}</span>
                    </div>
                  ))
                })()}
              </div>
            )}
          </div>

          {/* College Selection */}
          <div>
            <label className='block mb-2 font-medium'>
              College <span className='text-red-500'>*</span>{' '}
              {selectedProgram && (
                <span className='text-gray-500 text-sm font-normal'>
                  (Select colleges to rank for this program)
                </span>
              )}
            </label>
            <input
              type='text'
              value={collegeSearch}
              onChange={(e) => setCollegeSearch(e.target.value)}
              placeholder={
                selectedProgram
                  ? 'Search colleges to add...'
                  : 'Please select a program first'
              }
              className='w-full p-2 border rounded mb-2'
              disabled={!selectedProgram}
            />
            {selectedProgram && (
              <div className='max-h-60 overflow-y-auto border rounded'>
                {(() => {
                  // Filter out colleges that are already ranked for this program
                  const programRankings = rankings.find(
                    (r) => r.program?.id === selectedProgram.id
                  )
                  const rankedCollegeIds =
                    programRankings?.rankings?.map((r) => r.college?.id) || []
                  const availableColleges = colleges.filter(
                    (college) => !rankedCollegeIds.includes(college.id)
                  )

                  if (availableColleges.length === 0) {
                    return (
                      <div className='p-3 text-gray-500 text-sm text-center'>
                        {collegeSearch
                          ? 'No available colleges found'
                          : rankedCollegeIds.length > 0
                            ? 'All colleges are already ranked for this program'
                            : 'Type to search colleges...'}
                      </div>
                    )
                  }

                  return availableColleges.map((college) => (
                    <div
                      key={college.id}
                      onClick={() => setSelectedCollege(college)}
                      className={`p-3 cursor-pointer hover:bg-gray-100 flex items-center gap-3 ${
                        selectedCollege?.id === college.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      {college.college_logo && (
                        <div className='relative w-10 h-10 rounded-full overflow-hidden'>
                          <Image
                            src={college.college_logo}
                            alt={college.name}
                            fill
                            className='object-cover'
                          />
                        </div>
                      )}
                      <span className='text-sm'>{college.name}</span>
                    </div>
                  ))
                })()}
              </div>
            )}
          </div>

          <div className='flex justify-end gap-3 pt-4 border-t'>
            <button
              onClick={() => {
                setIsEditModalOpen(false)
                setEditingProgramId(null)
                setSelectedProgram(null)
                setSelectedCollege(null)
                setCollegeSearch('')
                setProgramSearch('')
                setShowProgramDropdown(false)
              }}
              className='px-4 py-2 border rounded hover:bg-gray-50'
            >
              Close
            </button>
            <Button
              onClick={handleAddRanking}
              disabled={!selectedProgram || !selectedCollege}
            >
              Add College
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setDeleteProgramId(null)
        }}
        onConfirm={handleDeleteProgram}
        title='Delete Rankings'
        message='Are you sure you want to delete all rankings for this program? This action cannot be undone.'
        confirmText='Delete'
        cancelText='Cancel'
      />

      <ToastContainer />
    </>
  )
}
