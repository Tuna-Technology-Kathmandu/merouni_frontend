import { authFetch } from '../utils/authFetch'

/**
 * Exports the database as a SQL file.
 * Triggers a download of the .sql file.
 */
export async function exportDatabase() {
    try {
        const url = `${process.env.baseUrl}/database/export`

        const response = await authFetch(url, {
            method: 'GET',
            cache: 'no-store'
        })

        if (!response.ok) {
            throw new Error('Failed to export database')
        }

        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl

        // Suggest a filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        link.setAttribute('download', `merouni-backup-${timestamp}.sql`)

        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(downloadUrl)

        return { success: true }
    } catch (error) {
        console.error('Error exporting database:', error)
        throw error
    }
}
