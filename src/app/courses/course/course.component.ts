import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { merge, fromEvent } from 'rxjs';

import { Course } from '../model/course';
import { CoursesService } from '../services/courses.service';
import { LessonsDataSource } from '../services/lessons.datasource';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit, AfterViewInit {

    course: Course | null = null;

    dataSource: LessonsDataSource | null = null;

    displayedColumns = ['seqNo', 'description', 'duration'];

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | null = null;

    @ViewChild(MatSort, { static: true }) sort: MatSort | null = null;

    @ViewChild('input', { static: true }) input: ElementRef | null = null;

    constructor(
        private route: ActivatedRoute,
        private coursesService: CoursesService,
    ) {

    }

    ngOnInit(): void {

        this.course = <Course> this.route.snapshot.data['course'];

        this.dataSource = new LessonsDataSource(this.coursesService);

        this.dataSource.loadLessons(this.course.id, '', 'asc', 0, 3);

    }

    ngAfterViewInit(): void {

        if (this.sort)
            this.sort.sortChange.subscribe(() => { if (this.paginator) this.paginator.pageIndex = 0; });

        if (this.input)
            fromEvent(this.input.nativeElement, 'keyup')
                .pipe(
                    debounceTime(150),
                    distinctUntilChanged(),
                    tap(() => {
                        if (this.paginator)
                            this.paginator.pageIndex = 0;

                        this.loadLessonsPage();
                    }),
                )
                .subscribe();

        if (this.sort && this.paginator)
            merge(this.sort.sortChange, this.paginator.page)
                .pipe(tap(() => this.loadLessonsPage()))
                .subscribe();

    }

    loadLessonsPage(): void {
        if (this.dataSource && this.course && this.input)
            this.dataSource.loadLessons(
                this.course.id,
                this.input.nativeElement.value,
                this.sort?.direction || 'up',
                this.paginator?.pageIndex || 0,
                this.paginator?.pageSize || 10,
            );
    }


}
