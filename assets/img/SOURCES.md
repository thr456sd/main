# Ball photography — drop files here

The tray fills **column-major**: slots 1–3 are the left column top to bottom, 4–6
the second column, and so on. Order is set by the `BALLS` array in
`assets/js/data.js`; this table matches it.

Save each product photo to the filename below, in `assets/img/`. Until a file
exists the tray falls back to the drawn sphere with the brand name on it, so the
page never shows a broken image.

| # | Col,Row | Filename | Product | Source |
| --- | --- | --- | --- | --- |
| 1 | 1,1 | `prov1-white.png` | Titleist Pro V1 — White | https://www.titleist.com/product/pro-v1/005PV1T.html?dwvar_005PV1T_color=WHT |
| 2 | 1,2 | `prov1-green.png` | Titleist Pro V1 — Green | https://www.titleist.com/product/pro-v1/005PV1T.html?dwvar_005PV1T_color=GRN |
| 3 | 1,3 | `prov1x-left-dash.png` | Titleist Pro V1x Left Dash | https://www.titleist.com/product/pro-v1x-left-dash/26PVLD.html |
| 4 | 2,1 | `chrome-tour-trutrack-usa.png` | Callaway Chrome Tour TruTrack USA | https://www.callawaygolf.com/newchrometour/balls-2024-chrome-tour-trutrack-usa.html |
| 5 | 2,2 | `chrome-tour-triple-track.png` | Callaway Chrome Tour Triple Track | https://www.callawaygolf.com/balls/triple-track-golf-balls/balls-2026-chrome-tour-triple-track.html |
| 6 | 2,3 | `chrome-tour.png` | Callaway Chrome Tour | https://www.callawaygolf.com/balls/chrome-tour-balls/balls-2026-chrome-tour.html |
| 7 | 3,1 | `tp5x.png` | TaylorMade TP5x | https://www.taylormadegolf.com/TP5x-Golf-Balls/DW-TE923.html?lang=en_US |
| 8 | 3,2 | `tp5x-pix.png` | TaylorMade TP5x pix | …`&dwvar_DW-TE923_color=M10501` |
| 9 | 3,3 | `tp5x-stripe.png` | TaylorMade TP5x Stripe | …`&dwvar_DW-TE923_color=M10553` |
| 10 | 4,1 | `tour-b-x.png` | Bridgestone Tour B X | https://www.bridgestonegolf.com/en-us/balls/tour-series/tour-bx |
| 11 | 4,2 | `tour-b-x.png` | Bridgestone Tour B X *(same URL supplied twice)* | as above |
| 12 | 4,3 | `z-star-diamond.png` | Srixon Z-Star Diamond | https://us.dunlopsports.com/srixon/balls/z-star-series/z-star-diamond/z-star-diamond-golf-balls/MZSTARD3.html |

## File requirements

- **Square, transparent PNG**, ball centred and filling the frame.
- **512×512** is plenty — the ball renders about 130px, so 512 covers 2× displays.
- Shot straight on. The tray lights from the upper left; photos lit the same way
  sit best.
- The image is clipped to a circle (`border-radius: 50%`, `object-fit: contain`),
  so leave no border or drop shadow baked in — the tray supplies its own.

Slots 10 and 11 point at the same file because the same Bridgestone URL was
supplied for both. Swap slot 11 in `data.js` (`id: 'tour-b-x-2'`) for a different
ball whenever you want twelve distinct products.

## Licensing

These are manufacturer product photographs. Using them on a storefront needs
permission from each brand — normally granted through an authorised-retailer or
reseller asset programme, which is also where you get clean transparent PNGs.
Every one of these sites blocks automated downloads, so the files have to come
from a brand asset portal or your own photography.
