import type {
  LineWidgetMatch,
  LineWidgetConfig,
  LineWidgetsInput,
} from '../types';

/**
 * Checks if a line matches the widget's match criteria
 *
 * @param match - The match specification (boolean, RegExp, or function)
 * @param line - The line content (plain text)
 * @param lineNumber - The 1-based line number
 * @returns true if the line matches
 */
export function matchesLine(
  match: LineWidgetMatch | undefined,
  line: string,
  lineNumber: number
): boolean {
  // Default to true (match all lines)
  if (match === undefined || match === true) {
    return true;
  }

  // Explicit false means no lines
  if (match === false) {
    return false;
  }

  // RegExp test
  if (match instanceof RegExp) {
    return match.test(line);
  }

  // Function call
  return match(line, lineNumber);
}

/**
 * Gets all widgets that match a specific line
 *
 * @param widgets - Array of widget configurations
 * @param line - The line content (plain text)
 * @param lineNumber - The 1-based line number
 * @returns Array of matching widget configurations
 */
export function getMatchingWidgets(
  widgets: LineWidgetsInput | undefined,
  line: string,
  lineNumber: number
): LineWidgetConfig[] {
  if (!widgets || widgets.length === 0) {
    return [];
  }

  return widgets.filter((widget) => matchesLine(widget.match, line, lineNumber));
}

/**
 * Gets matching widgets filtered by display mode
 *
 * @param widgets - Array of widget configurations
 * @param line - The line content (plain text)
 * @param lineNumber - The 1-based line number
 * @param display - The display mode to filter by ('hover' or 'always')
 * @returns Array of matching widget configurations with the specified display mode
 */
export function getMatchingWidgetsByDisplay(
  widgets: LineWidgetsInput | undefined,
  line: string,
  lineNumber: number,
  display: 'hover' | 'always'
): LineWidgetConfig[] {
  return getMatchingWidgets(widgets, line, lineNumber).filter(
    (widget) => widget.display === display
  );
}

/**
 * Gets matching widgets filtered by position
 *
 * @param widgets - Array of widget configurations
 * @param line - The line content (plain text)
 * @param lineNumber - The 1-based line number
 * @param position - The position to filter by ('left' or 'right')
 * @returns Array of matching widget configurations with the specified position
 */
export function getMatchingWidgetsByPosition(
  widgets: LineWidgetsInput | undefined,
  line: string,
  lineNumber: number,
  position: 'left' | 'right'
): LineWidgetConfig[] {
  return getMatchingWidgets(widgets, line, lineNumber).filter(
    (widget) => widget.position === position
  );
}

/**
 * Checks if any widgets match a line with a specific display mode
 *
 * @param widgets - Array of widget configurations
 * @param line - The line content (plain text)
 * @param lineNumber - The 1-based line number
 * @param display - The display mode to check for
 * @returns true if at least one widget matches with the specified display mode
 */
export function hasMatchingWidgetsWithDisplay(
  widgets: LineWidgetsInput | undefined,
  line: string,
  lineNumber: number,
  display: 'hover' | 'always'
): boolean {
  return getMatchingWidgetsByDisplay(widgets, line, lineNumber, display).length > 0;
}
