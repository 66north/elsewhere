import{d as b,A as y,y as f}from"./hooks.module.JM0_Ku3s.js";import{u as t}from"./jsxRuntime.module.BbxW1e5M.js";import{S as m}from"./preact.module.DaYdYXBZ.js";function S({guides:w}){const[n,o]=b(!1),[l,s]=b(""),[c,u]=b(0),h=y(null),x=[{id:"nav-home",title:"Home",category:"Navigation",action:()=>i("/elsewhere")},{id:"nav-workshop",title:"Workshop",category:"Navigation",action:()=>i("/elsewhere/workshop")},{id:"nav-journal",title:"Journal",category:"Navigation",action:()=>i("/elsewhere/journal")},{id:"nav-build",title:"The Build",category:"Navigation",action:()=>i("/elsewhere/build")},{id:"nav-about",title:"About",category:"Navigation",action:()=>i("/elsewhere/about")},...w.map(e=>({id:`guide-${e.slug}`,title:e.title,category:e.category,action:()=>i(`/elsewhere/workshop/guides/${e.slug}`)}))],a=l?x.filter(e=>e.title.toLowerCase().includes(l.toLowerCase())||e.category.toLowerCase().includes(l.toLowerCase())):x.slice(0,8);f(()=>{u(0)},[l]),f(()=>{const e=r=>{(r.metaKey||r.ctrlKey)&&r.key==="k"&&(r.preventDefault(),o(!n),s("")),r.key==="Escape"&&(o(!1),s("")),n&&(r.key==="ArrowDown"?(r.preventDefault(),u(p=>(p+1)%a.length)):r.key==="ArrowUp"?(r.preventDefault(),u(p=>(p-1+a.length)%a.length)):r.key==="Enter"&&(r.preventDefault(),a[c]&&(a[c].action(),o(!1),s(""))))};return window.addEventListener("keydown",e),()=>window.removeEventListener("keydown",e)},[n,a,c]),f(()=>{n&&h.current&&h.current.focus()},[n]),f(()=>{const e=()=>{o(!0)};return window.addEventListener("elsewhere.palette.open",e),()=>window.removeEventListener("elsewhere.palette.open",e)},[]);const i=e=>{window.location.href=e},g=new Map;return a.forEach(e=>{g.has(e.category)||g.set(e.category,[]),g.get(e.category).push(e)}),t(m,{children:[n&&t(m,{children:[t("div",{class:"palette-backdrop",onClick:()=>o(!1)}),t("div",{class:"command-palette",children:[t("div",{class:"palette-input-wrap",children:[t("span",{class:"palette-icon",children:"⌘"}),t("input",{ref:h,type:"text",class:"palette-input",placeholder:"Search guides, navigate...",value:l,onInput:e=>s(e.target.value)})]}),a.length>0?t("div",{class:"palette-results",children:Array.from(g.entries()).map(([e,r],p)=>t("div",{children:[p>0&&t("div",{class:"palette-divider"}),t("div",{class:"palette-group",children:[t("div",{class:"palette-group-label",children:e}),r.map((d,z)=>{const v=a.findIndex(k=>k.id===d.id);return t("button",{class:`palette-item ${v===c?"is-selected":""}`,onClick:()=>{d.action(),o(!1),s("")},onMouseEnter:()=>u(v),children:t("div",{class:"palette-item-content",children:[t("span",{class:"palette-item-title",children:d.title}),e!=="Navigation"&&t("span",{class:"palette-item-meta",children:d.category})]})},d.id)})]})]},e))}):t("div",{class:"palette-empty",children:t("p",{children:['No results found for "',l,'"']})}),t("div",{class:"palette-footer",children:t("span",{class:"palette-hint",children:[t("kbd",{children:"↑↓"})," Navigate ",t("kbd",{children:"Enter"})," Select ",t("kbd",{children:"Esc"})," Close"]})})]})]}),t("style",{children:`
        .palette-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1999;
        }

        .command-palette {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2000;
          width: 90%;
          max-width: 500px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background: var(--bg-elev);
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          max-height: 60vh;
        }

        .palette-input-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          background: var(--bg);
        }

        .palette-icon {
          font-size: 16px;
          color: var(--fg-muted);
          flex-shrink: 0;
        }

        .palette-input {
          flex: 1;
          border: none;
          background: transparent;
          color: var(--fg);
          font-size: 16px;
          font-family: inherit;
          outline: none;
        }

        .palette-input::placeholder {
          color: var(--fg-muted);
        }

        .palette-results {
          flex: 1;
          overflow-y: auto;
          padding: 8px 0;
        }

        .palette-group {
          padding: 8px 0;
        }

        .palette-group-label {
          padding: 0 16px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--fg-soft);
          margin: 8px 0 4px;
        }

        .palette-divider {
          height: 1px;
          background: var(--border);
          margin: 8px 0;
        }

        .palette-item {
          display: block;
          width: 100%;
          padding: 10px 16px;
          border: none;
          background: transparent;
          color: inherit;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s;
        }

        .palette-item:hover,
        .palette-item.is-selected {
          background: var(--bg-sunken);
        }

        .palette-item-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .palette-item-title {
          font-size: 14px;
          color: var(--fg);
        }

        .palette-item-meta {
          font-size: 11px;
          color: var(--fg-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }

        .palette-empty {
          padding: 40px 20px;
          text-align: center;
          color: var(--fg-muted);
          font-size: 14px;
        }

        .palette-footer {
          padding: 12px 16px;
          border-top: 1px solid var(--border);
          background: var(--bg-sunken);
          font-size: 11px;
          color: var(--fg-muted);
          display: flex;
          justify-content: flex-end;
        }

        .palette-hint {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        kbd {
          padding: 2px 6px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 3px;
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          font-weight: 500;
        }

        /* Scrollbar styling */
        .palette-results::-webkit-scrollbar {
          width: 6px;
        }
        .palette-results::-webkit-scrollbar-track {
          background: transparent;
        }
        .palette-results::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 3px;
        }
        .palette-results::-webkit-scrollbar-thumb:hover {
          background: var(--border-strong);
        }
      `})]})}export{S as default};
