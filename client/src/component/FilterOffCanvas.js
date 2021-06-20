import React from 'react'

export const FilterOffCanvas = (props) => {

  const difficulty = ["easy", "medium", "hard", "expert"];
  const progress = ["unattempted", "in progress", "completed"]

  function something(variable, newState) {
    // updating object properties
    // https://stackoverflow.com/questions/9454863/updating-javascript-object-property/48209957
    // use string of variable as key of object
    // https://stackoverflow.com/questions/19837916/creating-object-with-dynamic-keys
    const new_obj = { ...props.filterVariables, [variable]: newState }
    props.setFilter(new_obj);
  }

  function resetOnClick() {
    props.setFilter({
      easy: true,
      medium: true,
      hard: true,
      expert: true,
      unattempted: true,
      inprogress: true,
      completed: true
    });
    document.getElementById("filterCanvasClose").click();
  }

  return (
    <div className="offcanvas offcanvas-end bg-dark text-light" id="offcanvasFilter">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title fs-4" id="offcanvasExampleLabel">Filter</h5>
        <button type="button" className="btn-close btn-close-white text-reset" id="filterCanvasClose" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        <table className="table align-middle">
          <tbody>
            {/* Difficulty */}
            <tr>
              <td><span className="fs-6 text-light">Difficulty</span></td>
              <td>
                <div className="dropdown my-1">
                  <AccordionRadio values={difficulty} title="Difficulty" disabled={false} something={(i, j) => something(i, j)} filterVariables={props.filterVariables} />
                </div>
              </td>
            </tr>

            {/* Progress */}
            <tr>
              <td><span className="fs-6 text-light">Progress</span></td>
              <td>
                <div className="dropdown my-1">
                  <AccordionRadio values={progress} title="Progress" disabled={!props.isAuthenticated} something={(i, j) => something(i, j)} filterVariables={props.filterVariables} />
                </div>
              </td>
            </tr>

          </tbody>
        </table>

        <button type="button" className="btn btn-secondary m-1" onClick={resetOnClick}>
          Reset
        </button>
      </div>
      <div className="offcanvas-footer">

      </div>
    </div>
  )
}

function AccordionRadio(props) {
  function createAccordionItemAttr(arr) {
    return arr.map(value => {
      const valueNoSpace = value.replace(/\s+/g, '');
      return {
        value: value,
        id: `flexSwitch${valueNoSpace}`,
        handleChange: (state) => { props.something(valueNoSpace, state) },
        initialState: props.filterVariables[valueNoSpace]
      };
    })
  }

  const itemsAtr = createAccordionItemAttr(props.values);
  const accordionId = "accordion" + props.title
  const accordionIdTarget = "#" + accordionId
  const collapseId = "collapse" + props.title
  const collapseIdTarget = "#" + collapseId


  return (
    <div className="accordion my-1" id={accordionId} >
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingOne">
          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={collapseIdTarget} disabled={props.disabled}>
            Select {props.title}
          </button>
        </h2>
        <div id={collapseId} className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent={accordionIdTarget}>
          <div className="accordion-body">
            {itemsAtr.map(obj => {
              return (
                <div className="form-check form-switch" key={obj.value}>
                  <input className="form-check-input" type="checkbox" id={obj.id} style={{ cursor: 'pointer' }} checked={obj.initialState} onChange={() => obj.handleChange(!obj.initialState)} />
                  <label className="form-check-label">{obj.value}</label>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}