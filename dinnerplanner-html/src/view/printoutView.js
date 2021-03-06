/* @jsx m*/
const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus 
              sagittis, quam vitae lobortis pharetra, arcu felis tempus nisl, a 
              rhoncus nisl nisl quis orci. Sed faucibus, sapien at lobortis placerat, 
              nisl velit feugiat nulla, vitae consectetur enim libero ut tortor. Proin 
              erat mauris, pretium eget sapien quis, auctor semper sem.`;

class PrintoutView {
  constructor(container, model) {
    this.model = model;
    this.container = container;
    this.printoutmydinner = undefined;
  }
  
  jsx = () => (
    <div>
      <div className="printoutmydinner" id="printoutmydinner" />
      <div className="printoutmain" id="printoutmain" />
    </div>
  )
  
  render() {
    m.render(this.container, this.jsx());
    
    if (this.printoutmydinner === undefined)
    this.printoutmydinner = new MyDinnerView(this.container.querySelector("#printoutmydinner"), this.model);
    
    this.afterRender();
  }
  
  afterRender() {
    this.printoutmydinner.render();
    this.dishPresenter(this.model.getFullMenu());
    this.model.addObserver(["dishes"], this.dishPresenter.bind(this), this);
  }

  dishPresenter(dishes) {
    let dishListJSX = dishes.map(dish => (
      <div className="printdiv">
        <img className="printpicdiv" src={dish.image} />
        <div className="descdiv">
          <h3>{dish.title}</h3>
          <div>{text}</div>
        </div>
        <div className="prepdiv">
          <h5>Preparation</h5>
          <div>{text}
          </div>
        </div>
      </div>))

    m.render(this.container.querySelector("#printoutmain"), dishListJSX);
  }

}