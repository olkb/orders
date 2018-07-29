# Order Status

I manage all of the shipping myself right now, and occasionally get help from a local shop that does larger scale fulfillment. Below is a list of the current shipping queue that gets fulfilled in order (oldest first) as the parts become available to ship.

If you see "combined with" with an order that still exists, this is still unmerged, and will be taken care of before shipping. 

Any orders that are displayed as ##########-1 were split off of the main order for some reason, and will be shipped separately.

*This page was last generated on {{formatDate date day="numeric" month="long" year="numeric"}} at {{formatDate date hour="numeric" minute="numeric"}} EST and is updated daily*

*The Github repo for this page is available here: https://github.com/olkb/orders*

{{#each orders}}
 {{math @index "+" 1}}. {{this.orderNumber}}{{combinedOrders this " combined with "}}
{{/each}}