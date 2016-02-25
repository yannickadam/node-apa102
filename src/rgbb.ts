/**
 * Class describing a (RGB) color with (B)rightness
 */
export class RGBB {

  public R:number;
  public G:number;
  public B:number;
  public BB:number;

  /**
   *
   * @param R   Red component (0-255)
   * @param G   Green component (0-255)
   * @param B   Blue component (0-255)
   * @param BB  Brightness (0-31)
   */
  constructor(R:number, G:number, B:number, BB:number) {
    this.R = R;
    this.G = G;
    this.B = B;
    this.BB = BB;
  }

  /**
   *
   * @param name        The name of the color to use
   * @param brightness  Brightness value (0-31, default is 31)
   * @returns {RGBB}
   */
  static fromColorName(name:string, brightness:number=31):RGBB {
      var color:any = RGBB.Colors[name.toLowerCase()];
      if( color ) {
        return new RGBB(color.R, color.G, color.B, brightness);
      }
      console.warn("RGBB.fromColorName - Could not find color ", name);
      return new RGBB(255, 255, 255, brightness);
  }

  static Colors = { "red": {R:255, G:0, B:0},
                    "green": {R:0, G:255, B:0},
                    "blue": {R:0, G:0, B:255}
                  }

}