import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visor-reportes',
  templateUrl: './visor-reportes.component.html',
  styleUrls: ['./visor-reportes.component.css']
})
export class VisorReportesComponent implements OnInit {

  ReportUrl: SafeResourceUrl;
  UrlString: string = "http://pruebas.sdis.gov.co/reportLineavida/ReportViewer";//"http://localhost/Reportes/ReportViewer";
  endloading: boolean = false;

  mpbcolor = 'primary';
  mpbmode = 'indeterminate';
  mpbvalue = 50;
  mpbbufferValue = 75;

  constructor(
    private router: Router,
    private domSanitizer: DomSanitizer) {
    this.ReportUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString);
    setTimeout(() => {
      this.endloading = true;
    }, 15000);
  }

  ngOnInit() {
  }

  Salir() {
    this.router.navigate(['/']);
  }

}
