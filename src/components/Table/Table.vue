<script>
/**
 * A table component for rendering simple data tables.
 * Vue draggable caused issues when importing the component library. 
 * I've made a non-TS copy and moved here.
 * Influenced by:
 * @see https://inclusive-components.design/data-tables/
 * @see https://bbc.github.io/gel/components/data-tables/
 * @see https://codepen.io/chriscoyier/pen/yLVNErX
 */
// import { defineComponent, PropType } from 'vue'
import Caret from './Caret.vue'
import Draggable from "vuedraggable"

/**
 * An object representation of a table column.
 * @typedef Column 
 * @type {object}
 * @property {string} name - a slug used to match data
 * @property {string} label - the label to use as the column header
 * @property {boolean} sortable - is this column sortable?
 * @property {Function} sortMethod - a custom sorting function
 * @property {string} align - left|right|center
 * @property {number} minWidth - minimum column width (in px)
 * @property {number} maxWidth - maximum column width (in px)
 */
// interface Column {
//   name: string,
//   label: string,
//   sortable?: boolean,
//   sortMethod?(): number,
//   align?: 'left'|'right'|'center',
//   minWidth?: number,
//   maxWidth?: number
// }

export default {
  name: 'ToolboxTable',
  components: { Caret, Draggable },
  props: {
    /** 
     * An array of column objects
     * @type {Column[]}
     */
    columns: {
      type: Array,
      required: true
    },

    /**
     * A row object contains properties that matches to column.name:
     * {
     *    column1: value,
     *    column2: value,
     *    ...
     * }
     * @typedef Row 
     * @type {object}
     */

    /** 
     * An array of table rows, represented as objects.
     * @type {Row[]}
     */
    data: {
      type: Array,
      required: true
    },

    /**
     * A unique identifier for each piece of row data.
     */
    rowKey: {
      type: String,
      default: 'id'
    },

    /**
     * Accepts a table caption. This will be provided to screen readers only.
     * @type {string}
     */
    caption: {
      type: String,
      default: ''
    },
    
    /**
     * Should we calculate the table columns to use an evenly distributed width?
     * @type {boolean}
     */
    evenlyDistributeColumns: {
      type: Boolean,
      default: false
    },

    /**
     * Should the table display with borders between cells?
     * @type {boolean}
     */
    bordered: {
      type: Boolean,
      default: false
    },

    /**
     * Should the table display with numbered rows?
     * @type {boolean}
     */
    numbered: {
      type: Boolean,
      default: false
    },
    
    /**
     * Optionally provide a header label for the number column
     * No label will be used if none is provided.
     * @type {string}
     */
    numberedLabel: {
      type: String,
      default: ''
    },

    /**
     * Optionally specify the width of the numbered column.
     * @type {number}
     */
    numberedWidth: {
      type: Number,
      default: 50
    },
    
    /**
     * Provide a custom empty cell string.
     * An em dash will be used if none is provided.
     */
    emptyCellContent: {
      type: String,
      default: ''
    },
    
    /**
     * Should the table header be sticky?
     * @type {boolean}
     */
    stickyHeader: {
      type: Boolean,
      default: false
    },

    /**
     * Should the first column be sticky?
     * @type {boolean}
     */
    stickyFirstColumn: {
      type: Boolean,
      default: false
    },

    /**
     * Option to enable drag and drop functionality on table rows.
     * When using the draggable feature, be sure to listen for the "drag-change" event.
     * @type {boolean}
     */
    draggable: {
      type: Boolean,
      default: false
    },

    /**
     * EXPERIMENTAL
     * Whether or not to include scroll shadows when table contents are scrollable.
     * @type {boolean}
     */
    scrollShadows: {
      type: Boolean,
      default: false
    },

     /**
     * Whether or not to display the table header as a footer too.
     * @type {boolean}
     */
    withFooter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sortedData: [],
      sortedBy: '', // column to sort on
      sortDirection: 'none', // "descending" | "ascending" | "none" | "other" | undefined,
      tableContentWidth: 0, // store the container width (in px)
      tableContentHeight: 0, // store the container height (in px)
      tableScrollWidth: 0, // store the scrollable width (in px)
      tableScrollHeight: 0 // store the scrollable height (in px)
    }
  },
  computed: {
    /**
     * Compute the table columns. 
     * Primarily for adding a numbered column.
     * @returns {Column[]}
     */
    tableColumns() {
      if (this.numbered) {
        const numberColumn = { 
          name: 'row-number', 
          label: this.numberedLabel,
          sortable: false,
          minWidth: this.numberedWidth,
          maxWidth: this.numberedWidth
        }
        const columns = this.columns.concat()
        columns.unshift(numberColumn)
        return columns
      }
      return this.columns
    },

    /**
     * Sort the data to populate the rows in the table.
     * @returns {Row[]}
     */
    rows() {
      return this.sortTableRows()
    },
    
    /**
     * Detect whether the content overflows horizontally, making it scrollable.
     * @returns {boolean}
     */
    isScrollableHorizontal() {
      return this.tableContentWidth < this.tableScrollWidth
    },

    /**
     * Detect whether the content overflows vertically, making it scrollable.
     * @returns {boolean}
     */
    isScrollableVertical() {
      return this.tableContentHeight < this.tableScrollHeight
    },

    /**
     * Detect whether the content overflows in either direction, making it scrollable.
     * @returns {boolean}
     */
    isScrollable() {
      return this.isScrollableHorizontal || this.isScrollableVertical
    },

    /**
     * To prevent a tab stop with no functionality, we only want to make a table focusable if it can be scrolled.
     * Set the tabIndex if the table is scrollable.
     * @returns {number}
     */
    tabIndex() {
      return this.isScrollable ? 0 : -1
    },

    /**
     * Is the table sorted in ascending order?
     * Utility for code simplification.
     * @returns {boolean}
     */
    isSortedAscending() {
      return this.sortDirection === 'ascending'
    }
  },
  mounted() {
    // @ts-ignore
    // Setup ResizeObservers to watch for changes in the table width
    // The ResizeObserver is available in all modern browsers, but we should check to be sure.
    if (typeof ResizeObserver !== 'undefined') {
      // @ts-ignore
      // Observe the scroll container to determine if a scroll effect is necessary after the element is resized.
      const scrollObserver = new ResizeObserver(this.updateTableContentDimensions)
      scrollObserver.observe(this.$el)
    }
  },
  created() {
    this.sortedData = this.sortTableRows()
  },
  methods: {
    /**
     * Sort by the selected column.
     */
    sortBy(column) {
      if (!column.sortable) {
        return
      }
      if (column.name === this.sortedBy) {
        if (this.isSortedAscending) {
          this.sortDirection = 'descending'
        } else {
          // reset search criteria
          this.sortedBy = ''
          this.sortDirection = 'none'
        }
      } else {
        this.sortedBy = column.name
        this.sortDirection = 'ascending'
      }
    },

    /**
     * Default sort method to be applied when clicking table headers.
     * Supports alphabetical and numeric sorting.
     */
    defaultSortMethod(a, b) {
      if (typeof a[this.sortedBy] === 'string' && typeof b[this.sortedBy] === 'string' ) {
        if(a[this.sortedBy].toLowerCase() < b[this.sortedBy].toLowerCase()) { return -1 }
        if(a[this.sortedBy].toLowerCase() > b[this.sortedBy].toLowerCase()) { return 1 }
        return 0
      } else {
        return b[this.sortedBy] - a[this.sortedBy] 
      }
    },

    sortTableRows() {
      if (this.sortedBy) {
        const column = this.columns.find(c => c.name === this.sortedBy)
        const sortingFunction = column && typeof column.sortMethod === 'function' 
          ? column.sortMethod 
          : this.defaultSortMethod
        const sortedData = this.data.slice().sort(sortingFunction)
        return this.isSortedAscending
          ? sortedData
          : sortedData.reverse()
      }
      return this.data
    },

    /**
     * Store the table dimensions for scrollable and column width calculations.
     * We can assume that we will only have one resizeObserverEntry object.
     */
    // @ts-ignore
    updateTableContentDimensions(resizeObserverEntries) {
      for (const entry of resizeObserverEntries) {
        this.tableContentWidth = entry.contentRect.width
        this.tableContentHeight = entry.contentRect.height
        this.tableScrollWidth = entry.target.scrollWidth
        this.tableScrollHeight = entry.target.scrollHeight
      }
    },

    /**
     * Calculate the column width, evenly distributing the columns in the available space.
     * Takes into account any set min or max widths.
     */
    calculateColumnWidth(column) {
      // Read min and max from the column.
      const columnWidthStyles = {
        width: '', // will be overwritten if even distribution is turned on.
        minWidth: column.minWidth ? `${column.minWidth}px` : '80px', // ensure we have a sensible default min width
        maxWidth: column.maxWidth ? `${column.maxWidth}px` : undefined
      }
      
      if (this.evenlyDistributeColumns) {
        // calculate the columns width if each column's width is standardized and evenly distributed (stored as %)
        const evenDistributionPercent = 1 / this.columns.length
        // subtract custom widths from table width so that unspecified columns distribute using the remaining space.
        // also account for borders
        const remainingTableWidth = this.tableContentWidth - this.totalCustomizedWidths() - 2 
        // calculate the even distribution in pixels
        const evenDistributionWidth = remainingTableWidth * evenDistributionPercent
        columnWidthStyles.width = `${evenDistributionWidth}px`
      }
      return columnWidthStyles 
    },
    
    /**
     * Add up all the custom column widths
     */
    totalCustomizedWidths() {
      let total = 0
      this.tableColumns.forEach((column) => {
        if (column.minWidth) {
          total += column.minWidth
        }
      })
      return total
    },

    formatCellContent(cellValue) {
      return Array.isArray(cellValue) 
        ? cellValue.join(' | ') 
        : cellValue 
    },

    handleDragChange(e) {
      console.log(e)
      this.$emit('dragChange', this.sortedData)
    }
  }
}
</script>

<template>
  <div
    :class="['tb-table', { 'scroll-shadows': scrollShadows, 'bordered': bordered, 'numbered': numbered, 'sticky-col': stickyFirstColumn, 'scrollable-x': isScrollableHorizontal }]"
    :tabindex="tabIndex"
    :style="`--numbered-col-width: ${bordered ? numberedWidth + 1 : numberedWidth }px`"
  >
    <table>
      <caption
        v-if="caption || $slots.caption"
        class="visually-hidden"
      >
        <slot name="caption">
          {{ caption }}
        </slot>
        <small v-if="tabIndex">
          <!-- Let screen readers know that this table is scrollable. -->
          (scroll to see more)
        </small>
      </caption>
      <thead :class="{ 'sticky': stickyHeader }">
        <tr>
          <th
            v-for="column in tableColumns"
            :key="column[rowKey]"
            :aria-sort="sortedBy === column.name ? sortDirection : undefined"
            :class="[ 
              `col-align-${column.align || 'center'}`, 
              { 'sortable': column.sortable },
              { 'sorted': sortedBy === column.name }
            ]"
            role="columnheader"
            scope="col"
            @click="sortBy(column)"
            :style="calculateColumnWidth(column)"
          >
            <div>
              {{ column.label }}
              <Caret
                v-if="sortedBy === column.name"
                :order="sortDirection"
              />
              <!-- Include a button for a11y -->              
              <button
                v-if="column.sortable"
                class="sort-button visually-hidden"
              >
                <span class="visually-hidden">Sort</span>
              </button>
            </div>
          </th>
        </tr>
      </thead>
    
      <Draggable 
        v-if="draggable"
        v-model="sortedData" 
        :item-key="rowKey"
        tag="tbody"
        drag-class="drag-item"
        ghost-class="drag-ghost"
        @change="handleDragChange"
      >
        <template #item="{ element, index }">
          <tr>
            <td v-if="numbered" class="row-number col-align-center">
              {{ index + 1 }}
            </td>
            <td
              v-for="column in columns"
              :key="column.name"
              :class="[
                `col-align-${column.align || 'center'}`,
                { 'empty': !element[column.name] }
              ]"
            >
              {{ element[column.name] ? formatCellContent(element[column.name]) : emptyCellContent || '&#8211;' }}
            </td>
          </tr>
        </template>
      </Draggable>

      <tbody v-else>
        <tr
          v-for="(row, index) in rows"
          :key="index + 1"
        >
          <td v-if="numbered" class="row-number col-align-center">
            {{ index + 1 }}
          </td>
          <td
            v-for="column in columns"
            :key="column.name"
            :class="[
              `col-align-${column.align || 'center'}`,
              { 'empty': !row[column.name] }
            ]"
          >
            {{ row[column.name] ? formatCellContent(row[column.name]) : emptyCellContent || '&#8211;' }}
          </td>
        </tr>
      </tbody>
      
      <tfoot v-if="withFooter || $slots.footer">
        <slot name="footer">
          <!-- No footer specified, display the table headers -->
          <tr>
            <th
              v-for="column in tableColumns"
              :key="column.name"
              scope="col"
            >
              <div :style="calculateColumnWidth(column)">
                {{ column.label }}
              </div>
            </th>
          </tr>
        </slot>
      </tfoot>
    </table>
  </div>
</template>

<style scoped>
.tb-table {
  display: block;
  width: 100%;
  border: var(--table-border-thickness, var(--border-thickness)) solid var(--table-border-color, var(--border-color));
  border-radius: var(--table-border-radius, var(--border-radius));
  background: var(--table-bg-color, var(--white, white));
  overflow: auto;
  box-sizing: content-box;
}

/* FOCUS 
 * reminder: only focusable when scrollable. 
 * uses :focus-visible to only apply to keyboard focus
 */
 
.tb-table:focus {
  outline: none;
}

.tb-table:focus-visible {
  outline: 2px solid transparent; /* fallback for high-contrast mode. */
  box-shadow: 0 0 0 .25rem var(--focus-color, blue);
}
  
.tb-table table {
  min-width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  -webkit-overflow-scrolling: touch; /* enable iOS momentum scrolling */
}

.tb-table thead {
  width: 100%;
}

.tb-table th,
.tb-table td {
  border: none;
  font-size: var(--text-sm);
  line-height: var(--leading-none);
}

.tb-table th {
  /* Horizontal padding in headers will cause content to grow larger than the screen,
   * so we make it 0 here and apply it to the children elements. */
  padding: 0;
  background-color: var(--table-header-bg-color, var(--primary, black));
  color: var(--table-header-text-color, var(--secondary, white));
  font-size: var(--table-header-font-size, var(--text-sm));
  font-weight: var(--font-bold);
  white-space: nowrap;
  vertical-align: bottom;
  user-select: none; /* prevent text selection when clicking headers */
}

.tb-table th > div {
  padding: var(--table-header-padding, var(--space-xs));
  line-height: var(--leading-normal);
  display: flex;
  justify-content: center;
  align-items: center;
}

.tb-table td {
  padding: var(--table-cell-padding, var(--space-xs));
  font-weight: var(--font-semi);
  white-space: normal;
  vertical-align: top;
}

.tb-table td.empty {
  background: var(--empty-cell-bg);
  color: var(--empty-cell-color);
  font-weight: var(--empty-cell-font-weight);
}

/** BORDERED **/

.tb-table.bordered table {
  border-collapse: initial;
}

.tb-table.bordered th {
  border-right: 
    var(--table-header-border-thickness, var(--table-border-thickness, 1px)) 
    solid 
    var(--table-header-border-color, var(--table-border-color, var(--secondary)));
}

.tb-table.bordered td {
  border-right: 
    var(--table-border-thickness, 1px)
    solid 
    var(--table-border-color, var(--primary));
}

.tb-table.bordered th:last-of-type,
.tb-table.bordered td:last-of-type {
  border-right: none;
}

.tb-table.bordered td {
  border-bottom: 
    var(--table-border-thickness, 1px)
    solid 
    var(--table-border-color, var(--primary));
}

.tb-table.bordered tr:last-of-type td {
  border-bottom: none;
}

/** STICKY HEADER **/

.tb-table thead.sticky {
  position: sticky;
  top: 0;
  z-index: 2;
}

/** STICKY FIRST COLUMN **/

.tb-table.sticky-col th:first-of-type,
.tb-table.numbered th:first-of-type, 
.tb-table.sticky-col td:first-of-type,
.tb-table.numbered td:first-of-type {
  position: sticky;
  left: 0;
  z-index: 1;
}

.tb-table.sticky-col th:first-of-type,
.tb-table.numbered th:first-of-type {
  z-index: 2;
}

.tb-table.scrollable-x td:first-of-type {
  background: var(--table-bg-color, var(--white, white));
}

/* Add a shadow when the table is scrollable */
.tb-table.scrollable-x.sticky-col:not(.numbered) th:first-of-type,
.tb-table.scrollable-x.numbered:not(.sticky-col) th:first-of-type, 
.tb-table.scrollable-x.sticky-col:not(.numbered) td:first-of-type,
.tb-table.scrollable-x.numbered:not(.sticky-col) td:first-of-type {
  box-shadow: 1px 0 0 rgba(0,0,0,.15);
}

/** NUMBERED + STICKY FIRST COLUMN **/

.tb-table.numbered.sticky-col th:nth-child(2), 
.tb-table.numbered.sticky-col td:nth-of-type(2) {
  position: sticky;
  left: var(--numbered-col-width);
  z-index: 1;
}

.tb-table.numbered.sticky-col th:nth-child(2) {
  z-index: 2;
}

/* Add a shadow when the table is scrollable */

.tb-table.scrollable-x.numbered.sticky-col th:nth-child(2),
.tb-table.scrollable-x.numbered.sticky-col td:nth-of-type(2) {
  box-shadow: 1px 0 0 rgba(0,0,0,.15);
}

.tb-table.scrollable-x.numbered.sticky-col td:nth-of-type(2) {
  background: var(--table-bg-color, var(--white, white));
}

/** SORTABLE COLUMNS */

.tb-table thead th.sortable:hover {
  cursor: pointer;
}

.tb-table .caret {
  justify-self: end;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: -.25rem;
  margin-left: .25rem;
  color: var(--table-header-text-color, var(--secondary, white));
}

/* COLUMN ALIGN */

.col-align-left {
  text-align: left;
}

.col-align-center {
  text-align: center;
}

.col-align-right {
  text-align: right;
}

/** DRAGGABLE **/
.drag-ghost {
  opacity: .75;
  color: var(--accent, var(--focus-color));
}

.drag-item td {
  background-color: transparent !important;
  box-shadow: none !important;
}

/* EXPERIMENTAL FEATURE: SCROLL SHADOWS */

.scroll-shadows {    
  /* Adds scroll shadows
   * inspired by David Bushell's CSS Responsive Tables: http://dbushell.com/2016/03/04/css-only-responsive-tables/
   * and Lea Verou's Pure CSS scrolling shadows https://lea.verou.me/2012/04/background-attachment-local/ */
  background:
    radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)),
    radial-gradient(farthest-side at 100% 50%, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)),
    radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)),
    radial-gradient(farthest-side at 0% 50%, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)),
    linear-gradient(white, white); /* default, bottom layer color */
  /* 
   * One of outstanding issue with scroll shadow feature.
   * TODO: use calculated header height for this calculation. 
   * IDEA: detect header height in JS and set CSS custom prop in the template to be read here. 
   * 
   * TODO: also need to figure out how to get this to play nice with fixed columns.
   */
  background-position:
    50% calc(3rem - 1px), /* account for chrome 1px bug */
    right,
    bottom,
    left,
    top left;
  background-size:
    80% 1rem,
    1rem 80%,
    80% 1rem,
    1rem 80%,
    100%;
  background-repeat: no-repeat;
}

/* Define gradients to override the scroll shadows when no scrolling is necessary. 
 * gradient on the first row to hide the top shadow */
.scroll-shadows tr:first-child {
  background-image: linear-gradient(to bottom, rgba(255,255,255, 1) 50%, rgba(255,255,255, 0) 100%);
  background-position: top;
  background-size: 100% 1.5rem;
  background-repeat: no-repeat;
}

/* gradient on the last cells to hide the right shadow */
.scroll-shadows td:last-child {
  background-image: linear-gradient(to left, rgba(255,255,255, 1) 50%, rgba(255,255,255, 0) 100%);
  background-position: right;
  background-size: 1.5rem 100%;
  background-repeat: no-repeat;
}

/* gradient on the bottom row to hide the bottom shadow */
.scroll-shadows tr:last-child {
  background-image: linear-gradient(to top, rgba(255,255,255, 1) 50%, rgba(255,255,255, 0) 100%);
  background-position: bottom;
  background-size: 100% 1.5rem;
  background-repeat: no-repeat;
}

/* gradient on the first cells to hide the left shadow */
.scroll-shadows td:first-child {
  background-image: linear-gradient(to right, rgba(255,255,255, 1) 50%, rgba(255,255,255, 0) 100%);
  background-size: 1.5rem 100%;
  background-repeat: no-repeat;
}
</style>
