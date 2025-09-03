#import "@preview/cmarker:0.1.6" // plugin para Markdown dentro do Typst

#let data = json(sys.inputs.data)    // pode ser um caminho para arquivo ou JSON bruto
#let md_text = read(sys.inputs.md)   // caminho para arquivo .md

#cmarker.render(md_text)

#for item in data [
  // imprime título e corpo (interpola com #)
  #item.title
  #item.body

  #pagebreak()
]
