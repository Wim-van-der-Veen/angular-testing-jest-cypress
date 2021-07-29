import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { CoursesModule } from '../courses.module';
import { CoursesCardListComponent } from './courses-card-list.component';
import { setupCourses } from '../common/setup-test-data';



describe('CoursesCardListComponent', () => {

    let component: CoursesCardListComponent;
    let fixture: ComponentFixture<CoursesCardListComponent>;
    let el: DebugElement;

    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        TestBed
            .configureTestingModule({ imports: [CoursesModule] })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(CoursesCardListComponent);
                component = fixture.componentInstance;
                el = fixture.debugElement;
            });
    });


    it('should create the component', () => {

        expect(component).toBeTruthy();

    });


    it('should display the course list', () => {

        component.courses = setupCourses();
        fixture.detectChanges();

        const cards = el.queryAll(By.css('.course-card'));

        expect(cards).toBeTruthy();
        expect(cards.length).toBe(12);
    });


    it('should display the first course', () => {

        component.courses = setupCourses();
        fixture.detectChanges();

        const course = component.courses[0];
        const card = el.query(By.css('.course-card:first-child'));
        const title = card.query(By.css('mat-card-title'));
        const image = card.query(By.css('img'));

        expect(card).toBeTruthy();
        expect(title.nativeElement.textContent).toEqual(course.titles.description);
        expect(image.nativeElement.src).toEqual(course.iconUrl);
    });

});
