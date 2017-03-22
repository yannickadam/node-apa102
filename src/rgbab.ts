/**
 * Class describing a (RGB) color with (A)lpha and (B)rightness
 */
export class RGBAB {

  public R:number;
  public G:number;
  public B:number;
  public A:number;
  public BB:number;

  /**
   *
   * @param R   Red component (0-255)
   * @param G   Green component (0-255)
   * @param B   Blue component (0-255)
   * @param A   Alpha (0-1)
   * @param BB  Brightness (0-31)
   */
  constructor(R:number, G:number, B:number, A:number, BB:number) {
    this.R = R;
    this.G = G;
    this.B = B;
    this.A = A;
    this.BB = BB;
  }

  /**
   *
   * @param color
   */
  public setRGBAB(color:RGBAB) {
    this.R = color.R;
    this.G = color.G;
    this.B = color.B;
    this.A = color.A;
    this.BB = color.BB;
  }

  /**
   * add
   * Adds another color. Alpha channel respected.
   * @param color
   */
  public add(color:RGBAB) {
    var invA = 1-color.A;
    this.R = (this.R * invA + color.R * color.A);
    this.G = (this.G * invA + color.G * color.A);
    this.B = (this.B * invA + color.B * color.A);
    this.BB = Math.min(this.BB + color.BB, 31);
  }

  /**
   *
   * @param name        The name of the color to use
   * @param alpha       Alpha percentage (0-1)
   * @param brightness  Brightness value (0-31, default is 31)
   * @returns {RGBAB}
   */
  static fromColorName(name:string, alpha:number=1, brightness:number=31):RGBAB {
      var color:any = RGBAB.Colors[name.toLowerCase()];
      if( color ) {
        return new RGBAB(color.R, color.G, color.B, alpha, brightness);
      }
      console.warn("RGBAB.fromColorName - Could not find color ", name);
      return new RGBAB(255, 255, 255, alpha, brightness);
  }

  static Colors:any = { "red": {R:255, G:0, B:0},
                    "green": {R:0, G:255, B:0},
                    "blue": {R:0, G:0, B:255},
		"black": {R:0, G:0, B:0}
                  };

  /**
   * Creates a RGBAB color from HSL values
   * @param h 
   * @param sl 
   * @param l 
   */                  
  static fromHSL(h: number, sl: number, l: number): RGBAB {

    let r = l;   // default to gray
    let g = l;
    let b = l;
    const v = (l <= 0.5) ? (l * (1.0 + sl)) : (l + sl - l * sl);
            
    if (v > 0)
    {
 
      const m = l + l - v;
      const sv = (v - m ) / v;
      h *= 6.0;
      const sextant = Math.floor(h);
      const fract = h - sextant;
      const vsf = v * sv * fract;
      const mid1 = m + vsf;
      const mid2 = v - vsf;
      
      switch (sextant)
      {
        case 0:
          r = v;
          g = mid1;
          b = m;
          break;
        
        case 1:
          r = mid2;
          g = v;
          b = m;
        break;
        
        case 2:
          r = m;
          g = v;
          b = mid1;
        break;
        
        case 3:
          r = m;
          g = mid2;
          b = v;
        break;
        
        case 4:
          r = mid1;
          g = m;
          b = v;
        break;
        
        case 5:
          r = v;
          g = m;
          b = mid2;
        break;
      }
    }

    return new RGBAB( Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255), 1, 31);          
  }

}
