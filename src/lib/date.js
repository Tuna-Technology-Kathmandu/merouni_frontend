import dayjs from 'dayjs'

export class FormatDate {

    static formatDate(date) {
        if (!date) return ''
        return dayjs(date).format('DD MMM YYYY')
    }
}