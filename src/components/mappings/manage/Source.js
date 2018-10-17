export default class Source {
  constructor(index, onChange) {
    onChange = onChange || null;
    this.sourceObj = {
      index: index
    };
    this.onChange = onChange;
  }
  setField(Reference, parent, shouldNotPropagate) {
    this.sourceObj = {
      type: 'Reference', // 'Reference' || 'Function'
      value: Reference,  // Reference || Function
      parent: parent,
      index: this.sourceObj.index
    };
    // if undefined or false
    if (!shouldNotPropagate) {
      this.propagate();
    }
  }
  setFunction(fnObject, parent, shouldNotPropagate) {
    const paramSources = [];
    fnObject.params.map((p, i) => {
      paramSources.push(new Source(i))
    });
    this.sourceObj = {
      type: 'Function', // 'Reference' || 'Function'
      value: fnObject.value,  // Reference || Function
      params: fnObject.params,  // null || [String]
      paramSources: paramSources,
      name: fnObject.name,
      parent: parent,
      index: this.sourceObj.index
    };
    // if undefined or false
    if (!shouldNotPropagate) {
      this.propagate();
    }
  }
  getSource() {
    return this.sourceObj;
  }
  clearSource() {
    this.sourceObj = {
      parent: this.sourceObj.parent,
      index: this.sourceObj.index
    };
    this.propagate();
  }
  propagate() {
    const parent = this.getSource().parent;
    const index = this.getSource().index;
    if (parent != null) {
      const paramSources = parent.getSource().paramSources;
      paramSources[index].sourceObj = this.getSource();
      parent.paramSources = paramSources;
      parent.propagate();
    } else {
      if (this.onChange != null) {
        this.onChange(this);
      }
    }
  }
}