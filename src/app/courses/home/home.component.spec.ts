import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CoursesModule } from '../courses.module';
import { HomeComponent } from './home.component';
import { setupCourses } from '../common/setup-test-data';
import { click } from '../common/test-utils';
import { CoursesService } from '../services/courses.service';


describe('HomeComponent', () => {

    let fixture: ComponentFixture<HomeComponent>;
    let component: HomeComponent;
    let el: DebugElement;
    let coursesService: any;

    const courses = setupCourses();
    const beginnerCourses = courses.filter(course => course.category === 'BEGINNER');
    const advancedCourses = courses.filter(course => course.category === 'ADVANCED');

    beforeEach(async () => {
        const coursesServiceSpy = {
            findCourseById: jest.fn(), // (courseId: number) => Observable<Course>
            findAllCourses: jest.fn(), // Observable<Course>[]
            saveCourse:     jest.fn(), // (courseId:number, changes: Partial<Course>) => Observable<Course>
            findLessons:    jest.fn(), /* (
                courseId:number,
                filter = '',
                sortOrder = 'asc',
                pageNumber = 0,
                pageSize = 3,
            ): Observable<Lesson[]>
            */
        };

        await TestBed.configureTestingModule({
            imports: [
                CoursesModule,
                NoopAnimationsModule,
            ],
            providers: [
                {
                    provide:  CoursesService,
                    useValue: coursesServiceSpy,
                },
            ],
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(HomeComponent);
                component = fixture.componentInstance;
                el = fixture.debugElement;
                coursesService = TestBed.inject(CoursesService);
            });

    });

    it('should create the component', () => {

        expect(component).toBeTruthy();

    });


    it('should display only beginner courses', async () => {

        coursesService.findAllCourses.mockImplementation(() => of(beginnerCourses));
        await coursesService.findAllCourses();
        fixture.detectChanges();

        const tabs = el.queryAll(By.css('.mat-tab-label'));
        expect(tabs).toBeTruthy();
        expect(tabs.length).toBe(1);
    });


    it('should display only advanced courses', async () => {

        coursesService.findAllCourses.mockImplementation(() => of(advancedCourses));
        await coursesService.findAllCourses();
        fixture.detectChanges();

        const tabs = el.queryAll(By.css('.mat-tab-label'));
        expect(tabs).toBeTruthy();
        expect(tabs.length).toBe(1);
    });


    it('should display both tabs', async () => {

        coursesService.findAllCourses.mockImplementation(() => of(courses));
        await coursesService.findAllCourses();
        fixture.detectChanges();

        const tabs = el.queryAll(By.css('.mat-tab-label'));
        expect(tabs).toBeTruthy();
        expect(tabs.length).toBe(2);
    });


    it('should display advanced courses when tab clicked - timeout', async () => {

        coursesService.findAllCourses.mockImplementation(() => of(courses));
        await coursesService.findAllCourses();
        fixture.detectChanges();

        const tabs = el.queryAll(By.css('.mat-tab-label'));
        expect(tabs).toBeTruthy();
        expect(tabs.length).toBe(2);

        let cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
        expect(cardTitles).toBeTruthy();
        expect(cardTitles.length).toBe(9);

        const advancedTab = tabs.find(tab => tab.nativeElement.textContent === 'Advanced');
        expect(advancedTab).toBeTruthy();
        if (advancedTab) {
            click(advancedTab);
            fixture.detectChanges();

            await fixture.whenStable();
            cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
        }
        expect(cardTitles).toBeTruthy();
        expect(cardTitles.length).toBe(3);
        expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
    });

});
