import {Component, NgModule, OnInit} from '@angular/core';

@Component({
  selector: 'app-create-doc',
  templateUrl: './create-doc.component.html',
  styleUrls: ['./create-doc.component.scss']
})
export class CreateDocComponent implements OnInit {
// todo build form for transaction create/edit
  constructor() { }

  ngOnInit() {
  }

}

@NgModule({
  declarations: [ CreateDocComponent ],
  exports: [ CreateDocComponent ]
})
export class CreateDocModule { }
