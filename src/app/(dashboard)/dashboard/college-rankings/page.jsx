'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import {
  Edit2,
  Trash2,
  Plus,
  GripVertical,
  X,
  Search,
  Trophy,
  Layers,
  Loader2,
  AlertCircle
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/ui/shadcn/dialog'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import Image from 'next/image'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import SearchSelectCreate from '@/ui/shadcn/search-select-create'
import { cn } from '@/app/lib/utils'
import * as actions from './actions'

export default function CollegeRankingsPage() {
  const { setHeading } = usePageHeading()
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteDegreeId, setDeleteDegreeId] = useState(null)
  const [deleteRankingId, setDeleteRankingId] = useState(null)
  const [isRemoveRankingDialogOpen, setIsRemoveRankingDialogOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDescModalOpen, setIsDescModalOpen] = useState(false)
  const [draggedItem, setDraggedItem] = useState(null)
  const [draggedDegree, setDraggedDegree] = useState(null)
  const [selectedDegree, setSelectedDegree] = useState(null)
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [description, setDescription] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadRankings = useCallback(async () => {
    try {
      setLoading(true)
      const data = await actions.fetchRankings()
      setRankings(data)
    } catch (error) {
      toast.error('Failed to fetch rankings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setHeading('College Rankings')
    loadRankings()
    return () => setHeading(null)
  }, [setHeading, loadRankings])

  const handleDeleteDegree = async () => {
    if (!deleteDegreeId) return
    try {
      await actions.deleteDegreeRankings(deleteDegreeId)
      toast.success('Rankings deleted successfully')
      loadRankings()
    } catch (error) {
      toast.error('Failed to delete rankings')
    } finally {
      setIsDialogOpen(false)
      setDeleteDegreeId(null)
    }
  }

  const handleDeleteRankingClick = (rankingId) => {
    setDeleteRankingId(rankingId)
    setIsRemoveRankingDialogOpen(true)
  }

  const handleDeleteRankingConfirm = async () => {
    if (!deleteRankingId) return
    try {
      await actions.deleteRanking(deleteRankingId)
      toast.success('Ranking removed')
      loadRankings()
    } catch (error) {
      toast.error('Failed to remove ranking')
    } finally {
      setIsRemoveRankingDialogOpen(false)
      setDeleteRankingId(null)
    }
  }

  const handleDragStart = (e, ranking, degreeId) => {
    setDraggedItem({ ranking, degreeId })
    e.dataTransfer.effectAllowed = 'move'
    e.target.style.opacity = '0.4'
  }

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, targetRanking, degreeId) => {
    e.preventDefault()
    if (!draggedItem || draggedItem.degreeId !== degreeId) return

    const degreeGroup = rankings.find((r) => r.degree?.id === degreeId)
    if (!degreeGroup) return

    const items = [...degreeGroup.rankings]
    const draggedIndex = items.findIndex((r) => r.id === draggedItem.ranking.id)
    const targetIndex = items.findIndex((r) => r.id === targetRanking.id)

    if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) {
      setDraggedItem(null)
      return
    }

    const [removed] = items.splice(draggedIndex, 1)
    items.splice(targetIndex, 0, removed)

    const updatedRankings = items.map((item, index) => ({
      id: item.id,
      rank: index + 1
    }))

    try {
      await actions.updateRankingOrder(degreeId, updatedRankings)
      toast.success('Ranking order updated')
      loadRankings()
    } catch (error) {
      toast.error('Failed to update ranking order')
    } finally {
      setDraggedItem(null)
    }
  }

  const handleDegreeDragStart = (e, degreeGroup) => {
    setDraggedDegree(degreeGroup)
    e.dataTransfer.effectAllowed = 'move'
    e.target.style.opacity = '0.4'
  }

  const handleDegreeDrop = async (e, targetDegreeGroup) => {
    e.preventDefault()
    if (!draggedDegree || draggedDegree.degree?.id === targetDegreeGroup.degree?.id) {
      setDraggedDegree(null)
      return
    }

    const items = [...rankings]
    const draggedIndex = items.findIndex((r) => r.degree?.id === draggedDegree.degree?.id)
    const targetIndex = items.findIndex((r) => r.degree?.id === targetDegreeGroup.degree?.id)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedDegree(null)
      return
    }

    const [removed] = items.splice(draggedIndex, 1)
    items.splice(targetIndex, 0, removed)

    const updatedDegreeOrders = items.map((item, index) => ({
      degree_id: item.degree?.id,
      degree_list_order: index + 1
    }))

    try {
      await actions.updateDegreeOrder(updatedDegreeOrders)
      toast.success('Degree order updated')
      loadRankings()
    } catch (error) {
      toast.error('Failed to update degree order')
    } finally {
      setDraggedDegree(null)
    }
  }

  const handleAddRanking = async () => {
    if (!selectedDegree || !selectedCollege) {
      toast.error('Please select both degree and college')
      return
    }

    try {
      setSubmitting(true)
      await actions.addRanking(selectedDegree.id, selectedCollege.id)
      toast.success('College added to ranking')
      loadRankings()

      // Close modal and clear selection
      setIsEditModalOpen(false)
      setSelectedDegree(null)
      setSelectedCollege(null)
    } catch (error) {
      toast.error(error.message || 'Failed to add ranking')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateDescription = async () => {
    if (!selectedDegree) return
    try {
      setSubmitting(true)
      await actions.updateDegreeDescription(selectedDegree.id, description)
      toast.success('Description updated successfully')
      loadRankings()
      setIsDescModalOpen(false)
      setSelectedDegree(null)
      setDescription('')
    } catch (error) {
      toast.error(error.message || 'Failed to update description')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredRankings = rankings.filter(group =>
    group.degree?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.rankings?.some(r => r.college?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const onSearchDegrees = async (q) => {
    const degrees = await actions.fetchDegrees(q)
    return degrees
  }

  const onSearchColleges = async (q) => {
    if (!selectedDegree) return []
    const colleges = await actions.fetchColleges(selectedDegree.id, q)

    // Filter out colleges already ranked for this degree
    const rankedCollegeIds = rankings.find(r => r.degree?.id === selectedDegree.id)
      ?.rankings?.map(r => r.college?.id) || []

    return colleges.filter(c => !rankedCollegeIds.includes(c.id))
  }

  if (loading && rankings.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-[60vh] gap-4'>
        <div className='relative'>
          <div className='w-16 h-16 rounded-full border-4 border-[#387cae]/10 border-t-[#387cae] animate-spin'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <Trophy size={20} className='text-[#387cae] animate-pulse' />
          </div>
        </div>
        <p className='text-gray-500 font-medium animate-pulse'>Loading college rankings...</p>
      </div>
    )
  }

  return (
    <div className='w-full'>
      {/* Sticky Header */}
      <div className='sticky mb-3 top-0 z-20 bg-gray-50/80 backdrop-blur-md pb-4 pt-2 -mt-2'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100'>
          <div className='relative w-full md:w-96 group'>
            <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#387cae] transition-colors' size={18} />
            <Input
              placeholder='Search degrees or colleges...'
              className='pl-11 h-11 rounded-md border-gray-200 bg-gray-50/50 focus:bg-white transition-all'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              setSelectedDegree(null)
              setSelectedCollege(null)
              setDescription('')
              setIsEditModalOpen(true)
            }}
          >
            <Plus size={20} />
            Add Ranking
          </Button>
        </div>
      </div>

      {/* Rankings Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
        {filteredRankings.map((degreeGroup) => (
          <div
            key={degreeGroup.degree?.id}
            draggable
            onDragStart={(e) => handleDegreeDragStart(e, degreeGroup)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDegreeDrop(e, degreeGroup)}
            className='bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col group/card hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300'
          >
            {/* Card Header */}
            <div className='p-5 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-2xl'>
              <div className='flex items-center gap-3 overflow-hidden'>
                <div className='cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-[#387cae] transition-colors'>
                  <GripVertical size={20} />
                </div>
                <div className='flex flex-col overflow-hidden'>
                  <h2 className='text-[15px] font-bold text-slate-900 truncate' title={degreeGroup.degree?.title}>
                    {degreeGroup.degree?.title}
                  </h2>
                  <span className='text-[11px] text-slate-500 font-semibold'>
                    {degreeGroup.rankings?.length || 0} Colleges Ranked
                  </span>
                </div>
              </div>
              <div className='flex gap-1'>
                <button
                  onClick={() => {
                    setSelectedDegree(degreeGroup.degree)
                    setDescription(degreeGroup.description || '')
                    setIsDescModalOpen(true)
                  }}
                  className='p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-md transition-colors'
                  title='Edit Description'
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => {
                    setSelectedDegree(degreeGroup.degree)
                    setSelectedCollege(null)
                    setDescription('')
                    setIsEditModalOpen(true)
                  }}
                  className='p-2 text-[#387cae] hover:bg-[#387cae]/5 rounded-md transition-colors'
                  title='Add more colleges'
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={() => {
                    setDeleteDegreeId(degreeGroup.degree?.id)
                    setIsDialogOpen(true)
                  }}
                  className='p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors'
                  title='Delete all rankings'
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Card Content - Ranking List */}
            <div className='p-4 space-y-3 flex-1 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-100'>
              {degreeGroup.description && (
                <div className='text-xs text-slate-500 mb-3 ml-2 italic leading-relaxed'>
                  "{degreeGroup.description}"
                </div>
              )}
              {degreeGroup.rankings?.length > 0 ? (
                degreeGroup.rankings.map((ranking) => (
                  <div
                    key={ranking.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, ranking, degreeGroup.degree?.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, ranking, degreeGroup.degree?.id)}
                    className='group/item flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-md hover:border-[#387cae]/30 hover:shadow-lg hover:shadow-[#387cae]/5 transition-all duration-200 cursor-grab active:cursor-grabbing'
                  >
                    <div className='text-gray-300 group-hover/item:text-[#387cae] transition-colors'>
                      <GripVertical size={18} />
                    </div>

                    <div className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-md font-bold text-xs shadow-sm',
                      ranking.rank === 1 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                        ranking.rank === 2 ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                          ranking.rank === 3 ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                            'bg-blue-50 text-blue-700 border border-blue-100'
                    )}>
                      #{ranking.rank}
                    </div>

                    <div className='flex-1 flex items-center gap-3 overflow-hidden'>
                      {ranking.college?.college_logo ? (
                        <div className='relative w-9 h-9 min-w-[36px] rounded-full overflow-hidden border border-gray-100 shadow-sm'>
                          <Image
                            src={ranking.college.college_logo}
                            alt={ranking.college.name}
                            fill
                            className='object-cover'
                          />
                        </div>
                      ) : (
                        <div className='w-9 h-9 min-w-[36px] rounded-full bg-gray-100 flex items-center justify-center text-gray-400'>
                          <Layers size={16} />
                        </div>
                      )}
                      <div className='flex flex-col min-w-0'>
                        <span className='text-[13px] font-bold text-slate-700 truncate'>
                          {ranking.college?.name}
                        </span>
                        <span className='text-[11px] text-slate-400 font-semibold truncate'>
                          {ranking.college?.collegeAddress?.city}, {ranking.college?.collegeAddress?.state}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteRankingClick(ranking.id)}
                      className='lg:opacity-0 group-hover/item:opacity-100 p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all'
                      title='Remove from ranking'
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className='flex flex-col items-center justify-center py-10 gap-2 opacity-50'>
                  <div className='p-3 rounded-full bg-gray-50 text-gray-300'>
                    <Trophy size={24} />
                  </div>
                  <p className='text-[11px] font-bold text-slate-400 uppercase tracking-wider'>No Colleges Ranked</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredRankings.length === 0 && !loading && (
        <div className='flex flex-col items-center justify-center py-20 gap-4 bg-white border border-dashed border-gray-200 rounded-3xl'>
          <div className='w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300'>
            <AlertCircle size={40} />
          </div>
          <div className='text-center'>
            <h3 className='text-lg font-bold text-gray-900'>No rankings found</h3>
            <p className='text-sm text-gray-500'>Click the "Add Ranking" button to start ranking colleges.</p>
          </div>
          {searchTerm && (
            <Button
              variant='outline'
              onClick={() => setSearchTerm('')}
              className='rounded-md h-10 border-gray-200'
            >
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedDegree(null)
          setSelectedCollege(null)
        }}
        closeOnOutsideClick={false}
      >
        <DialogContent className='max-w-xl p-0 overflow-hidden bg-white'>
          <DialogHeader className='p-6 border-b border-gray-100'>
            <DialogTitle className='text-xl font-bold text-gray-900 flex items-center gap-2'>
              <div className='w-10 h-10 rounded-md bg-[#387cae]/10 flex items-center justify-center text-[#387cae]'>
                <Plus size={20} />
              </div>
              {selectedDegree ? 'Rank more Colleges' : 'Add New Ranking'}
            </DialogTitle>
            <DialogDescription className='text-xs font-medium text-gray-500'>
              Select a degree and choose a college to add it to the rankings.
            </DialogDescription>
            <DialogClose onClick={() => setIsEditModalOpen(false)} />
          </DialogHeader>

          <div className='p-8 space-y-8'>
            {/* Degree Selection */}
            <div className='space-y-3'>
              <Label required className='text-[11px] '>
                Search Degree
              </Label>
              <SearchSelectCreate
                onSearch={onSearchDegrees}
                onSelect={setSelectedDegree}
                onRemove={() => {
                  setSelectedDegree(null)
                  setSelectedCollege(null)
                }}
                selectedItems={selectedDegree}
                placeholder='Search or select a degree...'
                displayKey='title'
                valueKey='id'
                isMulti={false}
                allowCreate={false}
              />
            </div>

            {/* College Selection */}
            <div className={cn(
              'space-y-3 transition-all duration-300',
              !selectedDegree && 'opacity-30 pointer-events-none grayscale'
            )}>
              <div className='flex items-center justify-between'>
                <Label required={!!selectedDegree} className='text-[11px] '>
                  Select College
                </Label>
                {selectedDegree && (
                  <span className='text-[10px] text-[#387cae] bg-[#387cae]/5 px-2 py-0.5 rounded-full font-bold uppercase tracking-tight'>
                    For {selectedDegree.title}
                  </span>
                )}
              </div>
              <SearchSelectCreate
                onSearch={onSearchColleges}
                onSelect={setSelectedCollege}
                onRemove={() => setSelectedCollege(null)}
                selectedItems={selectedCollege}
                placeholder={selectedDegree ? 'Search colleges...' : 'Please select a degree first'}
                displayKey='name'
                valueKey='id'
                isMulti={false}
                allowCreate={false}
              />
            </div>
          </div>

          <div className='p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3'>
            <Button
              variant='outline'
              onClick={() => setIsEditModalOpen(false)}
              className='h-11 px-6 rounded-md border-gray-200 font-bold text-slate-600'
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddRanking}
              disabled={!selectedDegree || !selectedCollege || submitting}
              className='h-11 px-8 rounded-md bg-[#387cae] hover:bg-[#387cae]/90 text-white font-bold shadow-lg shadow-[#387cae]/20 min-w-[140px]'
            >
              {submitting ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Adding...
                </>
              ) : (
                'Add to Ranking'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Description Edit Modal */}
      <Dialog
        isOpen={isDescModalOpen}
        onClose={() => {
          setIsDescModalOpen(false)
          setSelectedDegree(null)
          setDescription('')
        }}
        closeOnOutsideClick={false}
      >
        <DialogContent className='max-w-xl p-0 overflow-hidden bg-white'>
          <DialogHeader className='p-6 border-b border-gray-100'>
            <DialogTitle className='text-xl font-bold text-gray-900 flex items-center gap-2'>
              <div className='w-10 h-10 rounded-md bg-[#387cae]/10 flex items-center justify-center text-[#387cae]'>
                <Edit2 size={20} />
              </div>
              Edit Category Description
            </DialogTitle>
            <DialogDescription className='text-xs font-medium text-gray-500'>
              Add or update the description for "{selectedDegree?.title}".
            </DialogDescription>
            <DialogClose onClick={() => setIsDescModalOpen(false)} />
          </DialogHeader>

          <div className='p-8 space-y-4'>
            <Label className='text-[11px] font-bold uppercase tracking-wider text-slate-500'>
              Description
            </Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Enter a description for this ranking category...'
              className='w-full min-h-[120px] px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#387cae]/20 focus:border-[#387cae] bg-gray-50/50 focus:bg-white transition-all resize-y shadow-inner'
              rows={4}
            />
          </div>

          <div className='p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3'>
            <Button
              variant='outline'
              onClick={() => setIsDescModalOpen(false)}
              className='h-11 px-6 rounded-md border-gray-200 font-bold text-slate-600 hover:bg-slate-100'
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateDescription}
              disabled={submitting}
              className='h-11 px-8 rounded-md bg-[#387cae] hover:bg-[#387cae]/90 text-white font-bold shadow-lg shadow-[#387cae]/20 min-w-[140px]'
            >
              {submitting ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Saving...
                </>
              ) : (
                'Save Description'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation (Degree Group) */}
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setDeleteDegreeId(null)
        }}
        onConfirm={handleDeleteDegree}
        title='Delete Degree Rankings'
        message='Are you sure you want to delete all rankings for this degree? This action cannot be undone.'
        confirmText='Delete'
        cancelText='Cancel'
      />

      {/* Remove Confirmation (Single College) */}
      <ConfirmationDialog
        open={isRemoveRankingDialogOpen}
        onClose={() => {
          setIsRemoveRankingDialogOpen(false)
          setDeleteRankingId(null)
        }}
        onConfirm={handleDeleteRankingConfirm}
        title='Remove College'
        message='Are you sure you want to remove this college from the rankings? This will only remove this college from this degree list.'
        confirmText='Remove'
        cancelText='Cancel'
      />

      <ToastContainer position='bottom-right' />
    </div>
  )
}
