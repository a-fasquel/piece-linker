import {Component} from '@angular/core';
import {FileUploader} from './components/file-uploader/file-uploader';
import {Header} from './components/header/header';

@Component({
  selector: 'app-root',
  imports: [FileUploader, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'piece-linker';
}
