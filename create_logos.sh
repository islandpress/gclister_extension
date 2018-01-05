#!/bin/bash

arrow_head="path 'M 0,0  l -15,-5  +5,+5  -5,+5  +15,-5 z'"

convert -background black -fill lightgreen \
	-size 48x48 -gravity north \
	-font AvantGarde-DemiOblique label:'G   \n    C' \
	xc: -draw 'stroke lightgreen line 8,38 38,8' \
	          -draw "stroke lightgreen fill lightgreen
                 translate 38,8 rotate -45
                 $arrow_head
                " \
		  icon.png
