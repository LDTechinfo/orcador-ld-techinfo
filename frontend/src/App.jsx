
import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const initialCatalog = [
  { id:1, name:"Processador Intel i5", price:850.0 },
  { id:2, name:"Processador AMD Ryzen 5", price:780.0 },
  { id:3, name:"Placa-mãe ATX", price:450.0 },
  { id:4, name:"Memória DDR4 16GB", price:220.0 },
  { id:5, name:"SSD NVMe 500GB", price:350.0 },
  { id:6, name:"Fonte 650W Bronze", price:320.0 },
  { id:7, name:"Gabinete Mid Tower", price:280.0 },
  { id:8, name:"Placa de vídeo (estim.)", price:2200.0 },
  { id:9, name:"Cooler CPU", price:90.0 },
  { id:10, name:"Montagem e Testes", price:150.0 }
];

function formatBRL(v){ return v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}); }

export default function App(){
  const [catalog, setCatalog] = useState(initialCatalog);
  const [cart, setCart] = useState([]);
  const [client, setClient] = useState({name:"",email:""});
  const [notes, setNotes] = useState("");
  const quoteRef = useRef();

  function addToCart(item){
    setCart(prev=>{
      const found = prev.find(p=>p.id===item.id);
      if(found) return prev.map(p=>p.id===item.id ? {...p, qty:p.qty+1} : p);
      return [...prev,{...item, qty:1}];
    });
  }
  function updateQty(id, qty){
    if(qty<=0) { setCart(prev=>prev.filter(p=>p.id!==id)); return; }
    setCart(prev=>prev.map(p=>p.id===id?{...p,qty}:p));
  }
  function setPrice(id, price){
    setCatalog(prev=>prev.map(i=>i.id===id?{...i, price: Number(price)}:i));
  }
  const subtotal = cart.reduce((s,it)=>s+it.price*it.qty,0);

  async function exportPDF(){
    const element = quoteRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save(`orcamento_${new Date().toISOString().slice(0,10)}.pdf`);
  }

  async function sendEmail(){
    try{
      const canvas = await html2canvas(quoteRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      const pdfBase64 = pdf.output("datauristring");
      const payload = { to: client.email, subject: `Orçamento - ${client.name||"Cliente"}`, html: quoteRef.current.outerHTML, pdfBase64 };
      const res = await fetch("http://localhost:4000/api/send-quote", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload) });
      if(!res.ok) throw new Error("Falha");
      alert("Orçamento enviado! Verifique a caixa de entrada do cliente.");
    } catch(err){ console.error(err); alert("Erro ao enviar. Verifique backend."); }
  }

  return (
    <div className="container">
      <h1>Orçador - L&D Techinfo</h1>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1.6fr", gap:16, marginTop:12}}>
        <div className="card">
          <h3>Catálogo</h3>
          {catalog.map(item=>(
            <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
              <div>
                <div style={{fontWeight:600}}>{item.name}</div>
                <div style={{fontSize:12,color:"#6b7280"}}>Preço atual</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <input className="input" type="number" value={item.price} onChange={e=>setPrice(item.id, e.target.value)} style={{width:100}} />
                <button className="button" onClick={()=>addToCart(item)}>Adicionar</button>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <h3>Orçamento</h3>
            <div>
              <button className="button" onClick={exportPDF}>Baixar PDF</button>
              <button style={{marginLeft:8}} className="button" onClick={sendEmail}>Enviar por e-mail</button>
            </div>
          </div>

          <div ref={quoteRef} style={{marginTop:12, padding:12, background:"#fbfbfb", borderRadius:8}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <div>
                <div style={{fontSize:18,fontWeight:700}}>Orçador - L&D Techinfo</div>
                <div style={{fontSize:12,color:"#6b7280"}}>Telefone: (00) 0000-0000 | contato@ldtechinfo.com</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:12,color:"#6b7280"}}>Data</div>
                <div style={{fontWeight:600}}>{new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <div style={{marginBottom:8}}>
              <div style={{fontSize:12,color:"#6b7280"}}>Cliente</div>
              <div style={{fontWeight:600}}>{client.name || "—"} {client.email ? `(${client.email})` : ""}</div>
            </div>

            <table className="table">
              <thead><tr><th style={{textAlign:"left"}}>Item</th><th>Qtd</th><th style={{textAlign:"right"}}>Preço</th><th style={{textAlign:"right"}}>Total</th></tr></thead>
              <tbody>
                {cart.length===0 && <tr><td colSpan={4} style={{textAlign:"center",padding:16,color:"#9ca3af"}}>Nenhum item selecionado</td></tr>}
                {cart.map(row=>(
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.qty}</td>
                    <td style={{textAlign:"right"}}>{formatBRL(row.price)}</td>
                    <td style={{textAlign:"right"}}>{formatBRL(row.price * row.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{display:"flex",justifyContent:"flex-end",marginTop:12}}>
              <div style={{width:260}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#6b7280"}}><span>Subtotal</span><span>{formatBRL(subtotal)}</span></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:700,marginTop:6}}><span>Total</span><span>{formatBRL(subtotal)}</span></div>
              </div>
            </div>

            <div style={{marginTop:10}}>
              <div style={{fontSize:12,color:"#6b7280"}}>Observações</div>
              <div style={{background:"white",padding:8,borderRadius:6}}>{notes || "Nenhuma"}</div>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:12}}>
            <input className="input" placeholder="Nome do cliente" value={client.name} onChange={e=>setClient({...client,name:e.target.value})} />
            <input className="input" placeholder="E-mail do cliente" value={client.email} onChange={e=>setClient({...client,email:e.target.value})} />
            <input className="input" placeholder="Observações" value={notes} onChange={e=>setNotes(e.target.value)} />
          </div>

          <div style={{marginTop:12}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {cart.map(it=>(
                <div key={it.id} style={{display:"flex",gap:8,alignItems:"center",border:"1px solid #eef2f7",padding:8,borderRadius:8}}>
                  <div style={{fontSize:13}}>{it.name}</div>
                  <input className="input" type="number" value={it.qty} onChange={e=>updateQty(it.id, Number(e.target.value))} style={{width:64}} />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
