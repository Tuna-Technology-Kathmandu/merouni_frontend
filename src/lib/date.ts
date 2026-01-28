import dayjs from 'dayjs'

export class FormatDate {

    static formatDate(date: string) {
        return dayjs(date).format('DD MMM YYYY')
    }
}