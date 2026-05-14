import{d as r,y as b}from"./hooks.module.JM0_Ku3s.js";import{u as e}from"./jsxRuntime.module.BbxW1e5M.js";import{S as p}from"./preact.module.DaYdYXBZ.js";function y(){const[g,t]=r(!1),[l,a]=r(null),[i,c]=r(""),[d,s]=r("");b(()=>{try{const n=localStorage.getItem("elsewhere.garage"),o=n?JSON.parse(n):null;a(o),o?.gen&&c(o.gen),o?.engine&&s(o.engine)}catch{}},[]);const h=()=>{const n={};i&&(n.gen=i),d&&(n.engine=d);try{localStorage.setItem("elsewhere.garage",JSON.stringify(n)),a(n),t(!1),window.dispatchEvent(new CustomEvent("elsewhere.garage.change",{detail:n}))}catch{}},u=()=>{try{localStorage.removeItem("elsewhere.garage"),a(null),c(""),s(""),window.dispatchEvent(new CustomEvent("elsewhere.garage.change",{detail:null}))}catch{}},v=l?.gen?`${l.gen}${l.engine?" · "+l.engine:""}`:"Pick vehicle";return e(p,{children:[e("button",{type:"button",class:"btn btn-sm vehicle-picker-btn","aria-label":"Vehicle picker",onClick:()=>t(!0),children:[e("span",{class:"mono veh-label",children:"My Garage"}),e("span",{class:"mono veh-value",children:v})]}),g&&e(p,{children:[e("div",{class:"modal-backdrop",onClick:()=>t(!1)}),e("dialog",{class:"vehicle-picker-modal",open:!0,children:[e("div",{class:"modal-header",children:[e("h2",{children:"My Pajero"}),e("button",{type:"button",class:"btn btn-ghost btn-icon","aria-label":"Close",onClick:()=>t(!1),children:e("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",children:[e("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e("div",{class:"modal-content",children:[e("div",{class:"form-group",children:[e("label",{htmlFor:"gen-select",children:"Generation"}),e("select",{id:"gen-select",value:i,onChange:n=>c(n.target.value),class:"input",children:[e("option",{value:"",children:"Select generation"}),e("option",{value:"Gen 2",children:"Gen 2 (1990–1999)"}),e("option",{value:"Gen 3",children:"Gen 3 (1999–2006)"}),e("option",{value:"Gen 4",children:"Gen 4 (2006–2015)"})]})]}),e("div",{class:"form-group",children:[e("label",{htmlFor:"engine-select",children:"Engine"}),e("select",{id:"engine-select",value:d,onChange:n=>s(n.target.value),class:"input",children:[e("option",{value:"",children:"Select engine"}),e("option",{value:"4M40",children:"4M40 (2.5L Diesel)"}),e("option",{value:"4M41",children:"4M41 (3.2L Diesel)"}),e("option",{value:"6G72",children:"6G72 (3.0L Petrol)"}),e("option",{value:"6G74",children:"6G74 (3.5L Petrol)"}),e("option",{value:"6G75",children:"6G75 (3.8L Petrol)"})]})]}),e("p",{class:"modal-note",children:"Your selection is saved locally and used to filter compatible guides."})]}),e("div",{class:"modal-footer",children:[e("button",{type:"button",class:"btn btn-ghost",onClick:u,children:"Clear"}),e("button",{type:"button",class:"btn btn-primary",onClick:h,children:"Save"})]})]})]}),e("style",{children:`
        .vehicle-picker-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }

        .veh-label {
          font-size: 10px;
          opacity: 0.6;
        }

        .veh-value {
          font-size: 12px;
          font-weight: 500;
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .vehicle-picker-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
          width: 90%;
          max-width: 400px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background: var(--bg-elev);
          padding: 0;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          color: var(--fg);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid var(--border);
        }

        .modal-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .modal-content {
          padding: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .form-group:last-of-type {
          margin-bottom: 24px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 500;
          color: var(--fg);
        }

        .input {
          padding: 10px 12px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background: var(--bg-sunken);
          color: var(--fg);
          font-size: 14px;
          font-family: inherit;
        }

        .input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 2px var(--accent);
          opacity: 0.1;
        }

        .modal-note {
          font-size: 12px;
          color: var(--fg-muted);
          margin: 0;
          line-height: 1.5;
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          padding: 16px 20px;
          border-top: 1px solid var(--border);
        }

        .btn-primary {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
        }

        .btn-primary:hover {
          opacity: 0.9;
        }
      `})]})}export{y as default};
