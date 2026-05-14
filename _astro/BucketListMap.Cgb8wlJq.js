import{_ as m}from"./preload-helper.B82OvF-E.js";import{A as a,y as g}from"./hooks.module.JM0_Ku3s.js";import{u as r}from"./jsxRuntime.module.BbxW1e5M.js";const h={baseUrl:"/elsewhere"},f=i=>`${h.baseUrl.replace(/\/$/,"")}${i==="/"?"":i}`||"/";function v({destinations:i}){const s=a(null),t=a(null);return g(()=>{if(!(!s.current||t.current))return m(()=>import("./leaflet-src.Byf149Wh.js").then(o=>o.l),[]).then(o=>{t.current=o.default.map(s.current).setView([30,5],3),o.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors",maxZoom:19}).addTo(t.current);const d={visited:"#10b981","in-progress":"#f59e0b",pending:"#9ca3af"};if(i.forEach(e=>{const n=d[e.status],p=`
          <div style="
            width: 32px;
            height: 32px;
            background-color: ${n};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: white;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            cursor: pointer;
          ">
            ${e.status==="visited"?"✓":e.status==="in-progress"?"⟳":"○"}
          </div>
        `,c=o.default.divIcon({html:p,iconSize:[32,32],className:"bucket-list-marker"}),l=o.default.marker([e.latitude,e.longitude],{icon:c}).addTo(t.current),u=`
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; min-width: 200px;">
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1rem; font-weight: 600;">
              ${e.title}
            </h3>
            <p style="margin: 0.25rem 0; font-size: 0.875rem; color: #666;">
              <strong>${e.region}</strong> • ${e.countries.join(", ")}
            </p>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem;">
              ${e.description}
            </p>
            <a href="${f(`/bucketlist/${e.slug}`)}" style="
              display: inline-block;
              margin-top: 0.75rem;
              padding: 0.5rem 1rem;
              background-color: ${n};
              color: white;
              text-decoration: none;
              border-radius: 0.25rem;
              font-size: 0.875rem;
              font-weight: 500;
            ">
              View Details →
            </a>
          </div>
        `;l.bindPopup(u,{maxWidth:300,className:"bucket-list-popup"}),l.on("mouseover",function(){this.openPopup()}),l.on("mouseout",function(){this.closePopup()})}),i.length>0){const e=new o.default.FeatureGroup(i.map(n=>o.default.marker([n.latitude,n.longitude])));t.current.fitBounds(e.getBounds().pad(.1))}}),()=>{t.current&&(t.current.remove(),t.current=null)}},[i]),r("div",{children:[r("div",{ref:s,style:{width:"100%",height:"500px",borderRadius:"0.5rem",border:"1px solid var(--color-border)",marginBottom:"2rem"}}),r("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"1rem",marginBottom:"2rem"},children:[r("div",{style:{display:"flex",alignItems:"center",gap:"0.75rem"},children:[r("div",{style:{width:"24px",height:"24px",backgroundColor:"#10b981",borderRadius:"50%",border:"2px solid white"}}),r("span",{style:{fontSize:"0.875rem"},children:"Visited"})]}),r("div",{style:{display:"flex",alignItems:"center",gap:"0.75rem"},children:[r("div",{style:{width:"24px",height:"24px",backgroundColor:"#f59e0b",borderRadius:"50%",border:"2px solid white"}}),r("span",{style:{fontSize:"0.875rem"},children:"In Progress"})]}),r("div",{style:{display:"flex",alignItems:"center",gap:"0.75rem"},children:[r("div",{style:{width:"24px",height:"24px",backgroundColor:"#9ca3af",borderRadius:"50%",border:"2px solid white"}}),r("span",{style:{fontSize:"0.875rem"},children:"Pending"})]})]})]})}export{v as default};
