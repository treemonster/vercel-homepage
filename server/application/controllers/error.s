<?js
class errorController{
  constructor(e) {
    this._e=e
  }
  indexAction() {
    if(!isDebug()) return;
    echo('<pre>', this._e.stack, '</pre>')
  }
}
