import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private apiKey: string = 'N1L0ujendmscpP9EtCmekHmRLEACuUsv';
  private url: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  constructor(private http: HttpClient) {
    //obtener historial con localStorage
    // 1ra Forma
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    // 2da Forma
    // if(localStorage.getItem('historial')){
    //   this._historial = JSON.parse(localStorage.getItem('historial')!);
    // }
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  get historial() {
    return [...this._historial];
  }

  buscarGifs(query: string = '') {
    query = query.trim().toLocaleLowerCase();
    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);

      //guardar historial localStorage
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }


    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    console.log(params.toString());
    

    this.http
      .get<SearchGifsResponse>(`${this.url}/search`, {params})
      .subscribe((resp) => {
        console.log(resp);
        this.resultados = resp.data;
        //guardar resultados localStorage
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });
  }
}
