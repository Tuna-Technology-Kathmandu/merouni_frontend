// app/components/Scholarship.js
'use client'

import { useState, useEffect } from 'react'
import { getAllScholarships, createScholarship, updateScholarship, deleteScholarship } from './actions'
import Loading from '../../../components/Loading'

export default function ScholarshipManager() {
  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eligibilityCriteria: '',
    amount: '',
    applicationDeadline: '',
    renewalCriteria: '',
    contactInfo: ''
  })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    loadScholarships()
  }, [])

  const loadScholarships = async () => {
    try {
      const response = await getAllScholarships()
      setScholarships(response.items)
    } catch (error) {
      console.error('Error loading scholarships:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formattedData = {
        ...formData,
        amount: Number(formData.amount),
        applicationDeadline: formatDate(formData.applicationDeadline)
      }

      if (editingId) {
        await updateScholarship(editingId, formattedData)
      } else {
        await createScholarship(formattedData)
      }
      
      setFormData({
        name: '',
        description: '',
        eligibilityCriteria: '',
        amount: '',
        applicationDeadline: '',
        renewalCriteria: '',
        contactInfo: ''
      })
      setEditingId(null)
      loadScholarships()
    } catch (error) {
      console.error('Error saving scholarship:', error)
    }
  }

  const handleEdit = (scholarship) => {
    setFormData({
      name: scholarship.name,
      description: scholarship.description,
      eligibilityCriteria: scholarship.eligibilityCriteria,
      amount: scholarship.amount.toString(),
      applicationDeadline: formatDateForInput(scholarship.applicationDeadline),
      renewalCriteria: scholarship.renewalCriteria,
      contactInfo: scholarship.contactInfo
    })
    setEditingId(scholarship._id)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this scholarship?')) {
      try {
        await deleteScholarship(id)
        loadScholarships()
      } catch (error) {
        console.error('Error deleting scholarship:', error)
      }
    }
  }

  const formatDate = (date) => {
    return date.split('-').join('/')
  }

  const formatDateForInput = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0]
  }

  if (loading) return <div className='mx-auto'> <Loading/> </div>

  return (
    <div className="p-4 w-1/2 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Scholarship Management</h1>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Scholarship Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Eligibility Criteria"
            value={formData.eligibilityCriteria}
            onChange={(e) => setFormData({ ...formData, eligibilityCriteria: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <input
            type="date"
            value={formData.applicationDeadline}
            onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Renewal Criteria"
            value={formData.renewalCriteria}
            onChange={(e) => setFormData({ ...formData, renewalCriteria: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <input
            type="number"
            placeholder="Contact Information"
            value={formData.contactInfo}
            onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? 'Update Scholarship' : 'Add Scholarship'}
        </button>
      </form>

      {/* List */}
      <div className="grid gap-4">
        {scholarships.map((scholarship) => (
          <div key={scholarship._id} className="border p-4 rounded shadow">
            <h3 className="font-bold text-lg">{scholarship.name}</h3>
            <div className="mt-2 space-y-1 text-gray-600">
              <p><span className="font-semibold">Description:</span> {scholarship.description}</p>
              <p><span className="font-semibold">Eligibility:</span> {scholarship.eligibilityCriteria}</p>
              <p><span className="font-semibold">Amount:</span> ${scholarship.amount}</p>
              <p><span className="font-semibold">Deadline:</span> {new Date(scholarship.applicationDeadline).toLocaleDateString()}</p>
              <p><span className="font-semibold">Renewal Criteria:</span> {scholarship.renewalCriteria}</p>
              <p><span className="font-semibold">Contact:</span> {scholarship.contactInfo}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => handleEdit(scholarship)}
                className="mr-2 text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(scholarship._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}