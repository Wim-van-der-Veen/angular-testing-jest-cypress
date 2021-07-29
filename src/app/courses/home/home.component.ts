import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../model/course';
import { CoursesService } from '../services/courses.service';
import { sortCoursesBySeqNo } from './sort-course-by-seq';

@Component({
    selector:    'home',                  // spaces before EOL-comment should be good
    templateUrl: './home.component.html', // so that you can align it
    styleUrls:  ['./home.component.css'],
})
export class HomeComponent implements OnInit {

    beginnerCourses$: Observable<Course[]> = of([]);

    advancedCourses$: Observable<Course[]> = of([]);

    constructor(private coursesService: CoursesService) {

    }

    ngOnInit(): void {

        this.reloadCourses();

    }


    reloadCourses(): void {

        const courses$ = this.coursesService.findAllCourses();

        this.beginnerCourses$ = HomeComponent.filterByCategory(courses$, 'BEGINNER');

        this.advancedCourses$ = HomeComponent.filterByCategory(courses$, 'ADVANCED');

    }

    static filterByCategory(courses$: Observable<Course[]>, category: string): Observable<Course[]> {
        return courses$.pipe(
            map(courses => courses.filter(course => course.category === category).sort(sortCoursesBySeqNo)),
        );
    }

}
