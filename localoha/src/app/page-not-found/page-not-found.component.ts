import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  
  constructor(private router: Router){}

  ngOnInit(): void {
  this.ticTacToa = [];
  this.generateBox();
  this.jeuCommence = false;
  this.tourdeX = true;
  this.compteur = 0;
  this.hasWiner= false;
  this.joueurIndexs = [];
  this.machineIndexs = [];
  this.machineWins = false;
  this.timer = null;
  }

  goHome(){
    this.router.navigate(['/']);
  }

  // indexTicTacToa: number[] = [4,0,2,6,8,1,3,5,7];
  ticTacToa: {click: boolean; symbol: string}[] = [];
  jeuCommence = false;
  tourdeX: boolean = true;
  compteur = 0;
  hasWiner: boolean = false;
  joueurIndexs: number[] = [];
  machineIndexs: number[] = [];
  machineWins = false;
  timer : any = null;
  
  
  //generer les cases pour ngFor
  generateBox(){
    for (let i = 0; i<9; i++ ){
      this.ticTacToa.push({click: false, symbol: ''}); 
    }    
  }

  nextMove(index: number){
    this.jeuCommence = true;
    this.compteur++;
    this.ticTacToa[index].click = true;
    let symbolActual = this.tourdeX? 'X': 'O';
    let symbolMachine = this.tourdeX? 'O': 'X';
    this.ticTacToa[index].symbol = symbolActual;
    this.tourdeX = !this.tourdeX; // turn to machine
    console.log(this.compteur);
    
    
    let movePossible = -1;
    let autreMovePossible = -1;


    if (this.compteur < 10){
        let dangerIndex = this.checkMove(index); // pour machine
        
        for(let i=0; i< dangerIndex.length; i++){
          let linePos1 = dangerIndex[i][0];
          let linePos2 = dangerIndex[i][1];
          // console.log(linePos1,linePos2);
  
            if (this.ticTacToa[linePos1].symbol === symbolActual && this.ticTacToa[linePos2].symbol === symbolActual ){
              this.tourdeX = !this.tourdeX;
              this.hasWiner = true;
              break;
            }   
            else if (this.ticTacToa[linePos1].symbol === symbolActual) {
              if (movePossible === -1 && !this.ticTacToa[linePos2].click){
                movePossible = linePos2;
              }
            }
            else if (this.ticTacToa[linePos2].symbol === symbolActual) {
              if (movePossible === -1 && !this.ticTacToa[linePos1].click){
                movePossible = linePos1;
              }
            }
        }

        
      if (!this.hasWiner) {
        autreMovePossible = this.bestMove(symbolMachine);

        if (this.machineWins ||  movePossible === -1){
          movePossible = autreMovePossible;
        }

        this.timer = setTimeout(()=>{
          this.compteur++;
          this.ticTacToa[movePossible].symbol = symbolMachine;
          this.ticTacToa[movePossible].click = true;
          if (this.machineWins){
            this.hasWiner = true;
          }
          this.timer = null;
          if (!this.hasWiner){
            this.tourdeX = !this.tourdeX;
          }
        } , 2000);
      
      }
      
    }
  }

    checkMove(index: number): number[][] {
      switch(index){
        case 0:
          return [[4,8],[2,1],[6,3]];
          break;
        case 1: 
          return [[4,7],[0,2]];
          break;
        case 2: 
          return [[4,6],[0,1],[8,5]];
          break;
        case 3: 
          return [[4,5],[0,6]];
          break;
        case 5: 
          return [[4,3], [2,8]];
          break;
        case 6: 
          return [[4,2],[0,3],[8,7]];
          break;
        case 7: 
          return [[4,1],[6,8]];
          break;
        case 8: 
          return [[4,0],[6,7],[2,5]];
          break;
        default: // case 4
          return [[0,8],[2,6],[1,7],[3,5]]
      }
    }

    bestMove(symbol: string): number{
      let bestPosition = -1;
      for(let i=0; i< this.ticTacToa.length; i++){
        if (this.ticTacToa[i].symbol === symbol){
          let positions = this.checkMove(i);
          for(let j=0; j< positions.length; j++){
            let pos1 = positions[j][0];
            let pos2 = positions[j][1];
            if (this.ticTacToa[pos1].symbol === symbol && !this.ticTacToa[pos2].click){
              this.machineWins = true;
              return pos2;
            }
            else if (this.ticTacToa[pos2].symbol === symbol && !this.ticTacToa[pos1].click){
              this.machineWins = true;
              return pos1;
            }
            else if (bestPosition === -1 && !this.ticTacToa[pos1].click && !this.ticTacToa[pos2].click ){
              bestPosition = pos1;
            }
          }
        }
      }
      let unIndex!:number;
      
      if (bestPosition !== -1){
        return bestPosition;
      }
      else {
        unIndex = -1;
        // while (this.ticTacToa[unIndex].click){
        //   unIndex = Math.floor(Math.random()*9);
        // }
        // return unIndex;

        for(let i=0; i< this.ticTacToa.length; i++){
          if (!this.ticTacToa[i].click){
            unIndex = i;
          }
        }
        return unIndex;
      }
    }


    commencer(){
      this.tourdeX = !this.tourdeX;
      this.jeuCommence = true;
    }

    // recommencer(){
    //   this.ngOnInit();
    // }



}

