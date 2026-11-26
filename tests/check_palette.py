"""WCAG text contrast for the new evidence-component palette."""
def luminance(value):
 rgb=[int(value[i:i+2],16)/255 for i in (1,3,5)]
 return sum((v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4)*w for v,w in zip(rgb,(.2126,.7152,.0722)))
for fg,bg in [('#1d1d1f','#f5f5f7'),('#595960','#f5f5f7'),('#0066cc','#f5f5f7'),('#ffffff','#0066cc'),('#f3f1e9','#202521'),('#c1c8bc','#202521'),('#efb9a9','#202521'),('#111311','#efb9a9')]:
 a,b=sorted((luminance(fg),luminance(bg)));ratio=(b+.05)/(a+.05)
 assert ratio>=4.5,(fg,bg,ratio)
 print(f'{fg} on {bg}: {ratio:.2f}:1')
