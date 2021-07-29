import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from './courses.service';
import { COURSES, findLessonsForCourse } from '../../../../server/db-data';
import { Course } from '../model/course';

// xdescribe(...)  -- don't
// fdescribe(...)  -- focus
describe('CoursesService', () => {

    let httpTestingController: HttpTestingController;
    let coursesService: CoursesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:   [HttpClientTestingModule],
            providers: [CoursesService],
        });

        coursesService = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should retrieve all courses', () => {

        coursesService.findAllCourses()
            .subscribe(courses => {

                expect(courses).toBeTruthy();
                expect(courses.length).toBe(12);
                // eslint-disable-next-line @typescript-eslint/no-shadow
                const course = courses.find(course => course.id === 12);
                expect(course).toBeTruthy();
                if (course) {
                    expect(course.titles).toBeTruthy();
                    if (course.titles)
                        expect(course.titles.description).toBe('Angular Testing Course');
                }
            });

        const req = httpTestingController.expectOne('/api/courses');
        expect(req.request.method).toEqual('GET');
        req.flush({ payload: Object.values(COURSES) });
    });

    it('should retrieve a specific course (by id)', () => {

        coursesService.findCourseById(12)
            .subscribe(course => {
                expect(course).toBeTruthy();
                expect(course.id).toBe(12);
            });

        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('GET');
        req.flush(COURSES[12]);
    });

    it('should save the course data', () => {

        const changes: Partial<Course> = { titles: { description: 'Testing Course' } };

        coursesService.saveCourse(12, changes)
            .subscribe(course => {
                expect(course).toBeTruthy();
                expect(course.id).toBe(12);
            });

        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('PUT');
        if (changes && changes.titles)
            expect(req.request.body.titles.description)
                .toEqual(changes.titles.description);
        req.flush({
            ...COURSES[12],
            ...req.request.body,
        });
    });

    it('should give an error if save course data fails', () => {

        const changes: Partial<Course> = { titles: { description: 'Testing Course' } };

        coursesService.saveCourse(12, changes)
            .subscribe(
                () => {
                    fail('the save course operation should have failed');
                },
                error => {
                    expect(error.status).toBe(500);
                },
            );

        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('PUT');
        req.flush('Save course failed', {
            status:     500,
            statusText: 'Internal Server Error',
        });
    });

    it('should find a list of lessons', () => {

        coursesService.findLessons(12)
            .subscribe(lessons => {
                expect(lessons).toBeTruthy();
                expect(lessons.length).toBe(3);
            });

        // const req = httpTestingController.expectOne('/api/lessons?courseId=12&pageNumber=0');
        const req = httpTestingController.expectOne(reqIn => reqIn.url === '/api/lessons');
        expect(req.request.method).toEqual('GET');
        expect(req.request.params.get('courseId')).toEqual('12');
        expect(req.request.params.get('filter')).toEqual('');
        expect(req.request.params.get('sortOrder')).toEqual('asc');
        expect(req.request.params.get('pageNumber')).toEqual('0');
        expect(req.request.params.get('pageSize')).toEqual('3');
        req.flush({ payload: findLessonsForCourse(12).slice(0, 3) });
    });

    afterEach(() => {
        httpTestingController.verify();
    });
});
