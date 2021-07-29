import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { filter, tap } from 'rxjs/operators';

import { Course } from '../model/course';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';


@Component({
    selector:    'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls:  ['./courses-card-list.component.css'],
})
export class CoursesCardListComponent implements OnInit {

    @Input()
    courses: Course[] = [];

    @Output()
    courseEdited = new EventEmitter();

    constructor(private dialog: MatDialog) {

    }

    ngOnInit(): void {
        if (!this.courses)
            this.courses = [];
    }

    editCourse(course: Course): void {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = course;

        const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);


        dialogRef.afterClosed()
            .pipe(
                filter(val => !!val),
                tap(() => this.courseEdited.emit()),
            )
            .subscribe();

    }

}
