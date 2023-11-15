import { Component } from '@angular/core';
import { UploadService } from 'src/app/services/upload.service';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})

export class UploadComponent {

  uploadFiles: FileList | null = null;

  constructor(private uploadService: UploadService){

  }

  onUpload(){
    if (this.uploadFiles) {
      const formData = new FormData();
      
      for (let i = 0; i < this.uploadFiles.length; i++) {
        formData.append('uploads[]', this.uploadFiles[i], this.uploadFiles[i].name);
      }

      this.uploadService.uploadFile(formData).subscribe(
        (res) => console.log('Response:', res),
        (error) => console.error('Error:', error)
      );
    }
  }

  onFileChange(e: any): void{
    //console.log(e);
    this.uploadFiles = e.target.files;
  }

}
