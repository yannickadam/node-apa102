export class RGBB {

  public R:number;
  public G:number;
  public B:number;
  public BB:number;

  constructor(R:number, G:number, B:number, BB:number) {
    this.R = R;
    this.G = G;
    this.B = B;
    this.BB = BB;
  }

  static fromColorName(name:string, brightness:number=31) {
      var color = RGBB.Colors[name.toLowerCase()];
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