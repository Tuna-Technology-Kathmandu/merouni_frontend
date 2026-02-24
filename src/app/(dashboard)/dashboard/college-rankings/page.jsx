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
  const [deleteProgramId, setDeleteProgramId] = useState(null)
  const [deleteRankingId, setDeleteRankingId] = useState(null)
  const [isRemoveRankingDialogOpen, setIsRemoveRankingDialogOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [draggedItem, setDraggedItem] = useState(null)
  const [draggedProgram, setDraggedProgram] = useState(null)
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [selectedCollege, setSelectedCollege] = useState(null)
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

  const handleDeleteProgram = async () => {
    if (!deleteProgramId) return
    try {
      await actions.deleteProgramRankings(deleteProgramId)
      toast.success('Rankings deleted successfully')
      loadRankings()
    } catch (error) {
      toast.error('Failed to delete rankings')
    } finally {
      setIsDialogOpen(false)
      setDeleteProgramId(null)
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

  const handleDragStart = (e, ranking, programId) => {
    setDraggedItem({ ranking, programId })
    e.dataTransfer.effectAllowed = 'move'
    // Create a ghost image or style
    e.target.style.opacity = '0.4'
  }

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, targetRanking, programId) => {
    e.preventDefault()
    if (!draggedItem || draggedItem.programId !== programId) return

    const programGroup = rankings.find((r) => r.program?.id === programId)
    if (!programGroup) return

    const items = [...programGroup.rankings]
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
      await actions.updateRankingOrder(programId, updatedRankings)
      toast.success('Ranking order updated')
      loadRankings()
    } catch (error) {
      toast.error('Failed to update ranking order')
    } finally {
      setDraggedItem(null)
    }
  }

  const handleProgramDragStart = (e, programGroup) => {
    setDraggedProgram(programGroup)
    e.dataTransfer.effectAllowed = 'move'
    e.target.style.opacity = '0.4'
  }

  const handleProgramDrop = async (e, targetProgramGroup) => {
    e.preventDefault()
    if (!draggedProgram || draggedProgram.program?.id === targetProgramGroup.program?.id) {
      setDraggedProgram(null)
      return
    }

    const items = [...rankings]
    const draggedIndex = items.findIndex((r) => r.program?.id === draggedProgram.program?.id)
    const targetIndex = items.findIndex((r) => r.program?.id === targetProgramGroup.program?.id)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedProgram(null)
      return
    }

    const [removed] = items.splice(draggedIndex, 1)
    items.splice(targetIndex, 0, removed)

    const updatedProgramOrders = items.map((item, index) => ({
      program_id: item.program?.id,
      program_list_order: index + 1
    }))

    try {
      await actions.updateProgramOrder(updatedProgramOrders)
      toast.success('Program order updated')
      loadRankings()
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
      setSubmitting(true)
      await actions.addRanking(selectedProgram.id, selectedCollege.id)
      toast.success('College added to ranking')
      loadRankings()

      // Close modal and clear selection
      setIsEditModalOpen(false)
      setSelectedProgram(null)
      setSelectedCollege(null)
    } catch (error) {
      toast.error(error.message || 'Failed to add ranking')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredRankings = rankings.filter(group =>
    group.program?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.rankings?.some(r => r.college?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const onSearchPrograms = async (q) => {
    const allRankedProgramIds = rankings.map(r => r.program?.id)
    const programs = await actions.fetchPrograms(q)
    // Filter out programs that are already ranked unless we are just adding more to them
    // Actually, the current modal allows adding colleges to existing programs too.
    return programs
  }

  const onSearchColleges = async (q) => {
    if (!selectedProgram) return []
    const colleges = await actions.fetchColleges(selectedProgram.id, q)

    // Filter out colleges already ranked for this program
    const rankedCollegeIds = rankings.find(r => r.program?.id === selectedProgram.id)
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
    <div className='p-6 w-full space-y-6'>
      {/* Sticky Header */}
      <div className='sticky top-0 z-20 bg-gray-50/80 backdrop-blur-md pb-4 pt-2 -mt-2'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100'>
          <div className='relative w-full md:w-96 group'>
            <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#387cae] transition-colors' size={18} />
            <Input
              placeholder='Search programs or colleges...'
              className='pl-11 h-11 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              setSelectedProgram(null)
              setSelectedCollege(null)
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
        {filteredRankings.map((programGroup) => (
          <div
            key={programGroup.program?.id}
            draggable
            onDragStart={(e) => handleProgramDragStart(e, programGroup)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleProgramDrop(e, programGroup)}
            className='bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col group/card hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300'
          >
            {/* Card Header */}
            <div className='p-5 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-2xl'>
              <div className='flex items-center gap-3 overflow-hidden'>
                <div className='cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-[#387cae] transition-colors'>
                  <GripVertical size={20} />
                </div>
                <div className='flex flex-col overflow-hidden'>
                  <h2 className='text-[15px] font-bold text-slate-900 truncate' title={programGroup.program?.title}>
                    {programGroup.program?.title}
                  </h2>
                  <span className='text-[11px] text-slate-400 font-bold uppercase tracking-wider'>
                    {programGroup.rankings?.length || 0} Colleges Ranked
                  </span>
                </div>
              </div>
              <div className='flex gap-1'>
                <button
                  onClick={() => {
                    setSelectedProgram(programGroup.program)
                    setSelectedCollege(null)
                    setIsEditModalOpen(true)
                  }}
                  className='p-2 text-[#387cae] hover:bg-[#387cae]/5 rounded-xl transition-colors'
                  title='Add more colleges'
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={() => {
                    setDeleteProgramId(programGroup.program?.id)
                    setIsDialogOpen(true)
                  }}
                  className='p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors'
                  title='Delete all rankings'
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Card Content - Ranking List */}
            <div className='p-4 space-y-3 flex-1 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-100'>
              {programGroup.rankings?.length > 0 ? (
                programGroup.rankings.map((ranking) => (
                  <div
                    key={ranking.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, ranking, programGroup.program?.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, ranking, programGroup.program?.id)}
                    className='group/item flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:border-[#387cae]/30 hover:shadow-lg hover:shadow-[#387cae]/5 transition-all duration-200 cursor-grab active:cursor-grabbing'
                  >
                    <div className='text-gray-300 group-hover/item:text-[#387cae] transition-colors'>
                      <GripVertical size={18} />
                    </div>

                    <div className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-lg font-bold text-xs shadow-sm',
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
                      className='lg:opacity-0 group-hover/item:opacity-100 p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all'
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
              className='rounded-xl h-10 border-gray-200'
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
          setSelectedProgram(null)
          setSelectedCollege(null)
        }}
        closeOnOutsideClick={false}
      >
        <DialogContent className='max-w-xl p-0 overflow-hidden bg-white'>
          <DialogHeader className='p-6 border-b border-gray-100'>
            <DialogTitle className='text-xl font-bold text-gray-900 flex items-center gap-2'>
              <div className='w-10 h-10 rounded-xl bg-[#387cae]/10 flex items-center justify-center text-[#387cae]'>
                <Plus size={20} />
              </div>
              {selectedProgram ? 'Rank more Colleges' : 'Add New Ranking'}
            </DialogTitle>
            <DialogDescription className='text-xs font-medium text-gray-500'>
              Select a program and choose a college to add it to the rankings.
            </DialogDescription>
            <DialogClose onClick={() => setIsEditModalOpen(false)} />
          </DialogHeader>

          <div className='p-8 space-y-8'>
            {/* Program Selection */}
            <div className='space-y-3'>
              <Label required className='text-[11px] '>
                Search Program
              </Label>
              <SearchSelectCreate
                onSearch={onSearchPrograms}
                onSelect={setSelectedProgram}
                onRemove={() => {
                  setSelectedProgram(null)
                  setSelectedCollege(null)
                }}
                selectedItems={selectedProgram}
                placeholder='Search or select a program...'
                displayKey='title'
                valueKey='id'
                isMulti={false}
                allowCreate={false}
              />
            </div>

            {/* College Selection */}
            <div className={cn(
              'space-y-3 transition-all duration-300',
              !selectedProgram && 'opacity-30 pointer-events-none grayscale'
            )}>
              <div className='flex items-center justify-between'>
                <Label required={!!selectedProgram} className='text-[11px] '>
                  Select College
                </Label>
                {selectedProgram && (
                  <span className='text-[10px] text-[#387cae] bg-[#387cae]/5 px-2 py-0.5 rounded-full font-bold uppercase tracking-tight'>
                    Offering {selectedProgram.title}
                  </span>
                )}
              </div>
              <SearchSelectCreate
                onSearch={onSearchColleges}
                onSelect={setSelectedCollege}
                onRemove={() => setSelectedCollege(null)}
                selectedItems={selectedCollege}
                placeholder={selectedProgram ? 'Search colleges...' : 'Please select a program first'}
                displayKey='name'
                valueKey='id'
                isMulti={false}
                allowCreate={false}
              />
            </div>

            {selectedProgram && !selectedCollege && (
              <div className='p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300'>
                <Trophy className='text-[#387cae] shrink-0' size={18} />
                <p className='text-xs text-[#387cae] font-medium leading-relaxed'>
                  Colleges ranked here are specific to the <b>{selectedProgram.title}</b> program.
                  You can drag and drop them in the main view to adjust their rank.
                </p>
              </div>
            )}
          </div>

          <div className='p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3'>
            <Button
              variant='outline'
              onClick={() => setIsEditModalOpen(false)}
              className='h-11 px-6 rounded-xl border-gray-200 font-bold text-slate-600'
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddRanking}
              disabled={!selectedProgram || !selectedCollege || submitting}
              className='h-11 px-8 rounded-xl bg-[#387cae] hover:bg-[#387cae]/90 text-white font-bold shadow-lg shadow-[#387cae]/20 min-w-[140px]'
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

      {/* Delete Confirmation (Program Group) */}
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setDeleteProgramId(null)
        }}
        onConfirm={handleDeleteProgram}
        title='Delete Program Rankings'
        message='Are you sure you want to delete all rankings for this program? This action cannot be undone.'
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
        message='Are you sure you want to remove this college from the rankings? This will only remove this college from this program list.'
        confirmText='Remove'
        cancelText='Cancel'
      />

      <ToastContainer position='bottom-right' />
    </div>
  )
}
