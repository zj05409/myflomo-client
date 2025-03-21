import { format } from 'date-fns';

export const formatDate = (timestamp: number): string => {
    return format(timestamp, 'yyyy-MM-dd HH:mm:ss');
}; 