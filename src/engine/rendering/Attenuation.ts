export default class Attenuation {
  constant: number;
  linear: number;
  exponent: number;

  constructor(constant: number, linear: number, exponent: number) {
    this.constant = constant;
    this.linear = linear;
    this.exponent = exponent;
  }
}
