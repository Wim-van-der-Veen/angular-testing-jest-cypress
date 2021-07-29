import { Course } from '../model/course';
import { COURSES } from '../../../../server/db-data';
import { sortCoursesBySeqNo } from '../home/sort-course-by-seq';


function sortUndef(a: unknown, b: unknown): number {
    return sortCoursesBySeqNo(<Course>a, <Course>b);
}

export function setupCourses() : Course[] {
    return Object.values(COURSES).sort(sortUndef) as Course[];
}
