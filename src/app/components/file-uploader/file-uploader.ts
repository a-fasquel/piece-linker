import {Component, OnInit} from '@angular/core';
import {FileUploadModule} from 'primeng/fileupload';
import * as am5 from "@amcharts/amcharts5";
import {ForceDirected} from '@amcharts/amcharts5/hierarchy';
import {Piece} from '../../model/bubble.model';

@Component({
  selector: 'app-file-uploader',
  imports: [FileUploadModule ],
  templateUrl: './file-uploader.html',
  styleUrl: './file-uploader.css'
})
export class FileUploader implements OnInit {

  csvContent: string = '';
  parsedData: string[][] = [];
  series: any = [];

  ngOnInit(): void {
    // Create root and chart
    let root = am5.Root.new("chartdiv");
    root.setThemes([
      am5.Theme.new(root)
    ]);
    let container = root.container.children.push(
      am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.verticalLayout
      })
    );
    this.series = container.children.push(
      ForceDirected.new(root, {
        downDepth: 1,
        initialDepth: 2,
        topDepth: 1,
        valueField: "value",
        categoryField: "name",
        idField: "id",
        childDataField: "children",
        linkWithField: "link",
        linkWithStrength: 0.1,
        manyBodyStrength: -30,
        centerStrength: 0.6,
        nodePadding: 10
      })
    );
    this.series.outerCircles.template.states.create("disabled", {
      fillOpacity: 0.5,
      strokeOpacity: 0,
      strokeDasharray: 0
    });

    this.series.outerCircles.template.states.create("hoverDisabled", {
      fillOpacity: 0.5,
      strokeOpacity: 0,
      strokeDasharray: 0
    });

    this.series.data.setAll([{
      name: "Root",
      value: 0,
      children: [
        {
          name: "Piece 1",
          value: 50,
          children: [{
            name: "Pivot",
            value: 10,
          }]
        },
        {
          name: "Piece 2",
          value: 50,
          children: [{
            name: "Plan",
            value: 10,
            link: ["Pivot"],
          }]
        }
      ]
    }]);
    this.series.set("selectedDataItem", this.series.dataItems[0]);
  }

  onFileSelected(event: any): void {
    const file: File = event.files[0];
    if (file && file.name.endsWith('.csv')) {
      const reader: FileReader = new FileReader();
      reader.onload = (e) => {
        this.csvContent = reader.result as string;
        this.parseCSV(this.csvContent);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid .csv file.');
    }
  }

  parseCSV(data: string): void {
    let lines : any[] = data.split('\n');
    //delete first line
    lines.shift();
    lines = lines.map(l => l.split(","))
    //map piece-liaison
    //Création de la liste des pièces
    let pieces : Piece[] = [...new Set(lines
      .map(l => l[0])
      .map(piece => new Piece(piece, piece, 30))
    )];
    pieces.push(...new Set(lines
      .map(l => l[1])
      .map(piece => new Piece(piece, piece, 30))
    ))
    pieces = pieces.filter(
      (piece, index, innerPieces) => {
        return index === innerPieces.findIndex((p) => p.name === piece.name)
      }
    )




    for (const piece of pieces) {

      let links = lines.filter(l => l[0] == piece.name)

      for (const link of links) {
        let linkedPiece = pieces.find(p => link[1] == p.name)
        piece.children.push(new Piece(link[2],link[2]+piece.name+linkedPiece!.name ,5, [link[2]+linkedPiece!.name+piece.name]));
        linkedPiece!.children.push(new Piece(link[2],link[2]+linkedPiece!.name+piece.name, 5, [link[2]+piece.name+linkedPiece!.name]));
      }
    }

    let rootPiece = new Piece("Root","Root", 0);
    rootPiece.children = pieces;
    this.series?.data.setAll([rootPiece]);
  }
}
