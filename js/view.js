const model = {
  state: {
    key: 4,
    val2: 2
  }
};

function setState(object) {
  var state = model.state;

  for (const key in object) {
    state[key] = object[key];
  }
  model.state = state;
}

x = setState({ val4: 3, val5: 3, key: 7 });
y = model.state

y


