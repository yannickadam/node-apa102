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
                    "blue": {R:0, G:0, B:255}
                  }

}