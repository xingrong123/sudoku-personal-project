import React from 'react'

export const FilterOffCanvas = (props) => {

  const difficulty = ["easy", "medium", "hard", "expert"];
  const progress = ["unattempted", "in progress", "completed"]

  function filterOnClick() {
    props.setFilter(true, {});
    document.getElementById("filterCanvasClose").click();
  }

  function resetOnClick() {
    props.setFilter(false, {
      difficulty: {
        easy: true,
        medium: true,
        hard: true,
        expert: true
      },
      progress: {
        unattempted: true,
        inprogress: true,
        completed: true
      }
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
                  <AccordionRadio values={difficulty} title="Difficulty" disabled={false} />
                </div>
              </td>
            </tr>

            {/* Progress */}
            <tr>
              <td><span className="fs-6 text-light">Progress</span></td>
              <td>
                <div className="dropdown my-1">
                  <AccordionRadio values={progress} title="Progress" disabled={!props.isAuthenticated} />
                </div>
              </td>
            </tr>

          </tbody>
        </table>

        <button type="button" className="btn btn-success m-1" onClick={filterOnClick}>
          Filter
        </button>
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
      return {
        value: value,
        id: `flexSwitch${value.replace(/\s+/g, '')}`
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
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id={obj.id} style={{ cursor: 'pointer' }} />
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