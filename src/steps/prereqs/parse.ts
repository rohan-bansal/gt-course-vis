/* eslint-disable max-classes-per-file */

import {
  ANTLRErrorListener,
  CharStreams,
  CommonTokenStream,
  Recognizer,
} from "antlr4ts";
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { ATNSimulator } from "antlr4ts/atn/ATNSimulator";
import { load } from "cheerio";

import { PrerequisitesLexer } from "./grammar/PrerequisitesLexer";
import {
  AtomContext,
  CourseContext,
  ExpressionContext,
  PrerequisitesParser,
  TermContext,
} from "./grammar/PrerequisitesParser";
import { PrerequisitesVisitor } from "./grammar/PrerequisitesVisitor";
import { error, warn } from "../../log";
import {
  MinimumGrade,
  PrerequisiteClause,
  PrerequisiteCourse,
  PrerequisiteOperator,
  Prerequisites,
  PrerequisiteSet,
} from "../../types";

/**
 * A map consisting of full course names and their corresponding abbreviations
 * from 1996-2023.
 */
const fullCourseNames = {
  "Vertically Integrated Project": "VIP",
  Wolof: "WOLO",
  "Electrical & Computer Engr": "ECE",
  "Computer Science": "CS",
  "Cooperative Work Assignment": "COOP",
  "Cross Enrollment": "UCGA",
  "Earth and Atmospheric Sciences": "EAS",
  English: "ENGL",
  "Foreign Studies": "FS",
  French: "FREN",
  "Georgia Tech": "GT",
  "Civil and Environmental Engr": "CEE",
  "College of Architecture": "COA",
  "College of Engineering": "COE",
  "Computational Mod, Sim, & Data": "CX",
  "Computational Science & Engr": "CSE",
  "Biological Sciences": "BIOS",
  Biology: "BIOL",
  "Biomed Engr/Joint Emory PKU": "BMEJ",
  "Biomedical Engineering": "BMED",
  "Industrial Design": "ID",
  "International Affairs": "INTA",
  "International Logistics": "IL",
  Internship: "INTN",
  "Intl Executive MBA": "IMBA",
  Japanese: "JAPN",
  Korean: "KOR",
  "Learning Support": "LS",
  Linguistics: "LING",
  "Literature, Media & Comm": "LMC",
  Management: "MGT",
  "Management of Technology": "MOT",
  "Manufacturing Leadership": "MLDR",
  "Materials Science & Engr": "MSE",
  Accounting: "ACCT",
  "Aerospace Engineering": "AE",
  "Air Force Aerospace Studies": "AS",
  "Applied Physiology": "APPH",
  "Mechanical Engineering": "ME",
  "Medical Physics": "MP",
  "Military Science & Leadership": "MSL",
  "Modern Languages": "ML",
  Music: "MUSI",
  "Naval Science": "NS",
  Neuroscience: "NEUR",
  Chemistry: "CHEM",
  Chinese: "CHIN",
  "City Planning": "CP",
  Economics: "ECON",
  "Elect & Comp Engr-Professional": "ECEP",
  Physics: "PHYS",
  "Political Science": "POL",
  "Polymer, Textile and Fiber Eng": "PTFE",
  Psychology: "PSYC",
  "Public Policy": "PUBP",
  "Public Policy/Joint GSU PhD": "PUBJ",
  Russian: "RUSS",
  Sociology: "SOC",
  Spanish: "SPAN",
  Mathematics: "MATH",
  "Center Enhancement-Teach/Learn": "CETL",
  "Chemical & Biomolecular Engr": "CHBE",
  "Biomedical Engr/Joint Emory": "BMEM",
  "Bldg Construction-Professional": "BCP",
  "Building Construction": "BC",
  Swahili: "SWAH",
  "Georgia Tech Lorraine": "GTL",
  German: "GRMN",
  "Global Media and Cultures": "GMC",
  "Health Systems": "HS",
  History: "HIST",
  "History, Technology & Society": "HTS",
  "Industrial & Systems Engr": "ISYE",
  "Nuclear & Radiological Engr": "NRE",
  Philosophy: "PHIL",
  "Applied Systems Engineering": "ASE",
  Arabic: "ARBC",
  Architecture: "ARCH",
  "Office of International Educ": "OIE",
  "College of Sciences": "COS",
  "Ivan Allen College": "IAC",
  "Serve, Learn, Sustain": "SLS",
  Persian: "PERS",
  Hebrew: "HEBW",
  Hindi: "HIN",
  "Int'l Plan Co-op Abroad": "IPCO",
  "Int'l Plan Intern Abroad": "IPIN",
  "Int'l Plan-Exchange Program": "IPFS",
  "Int'l Plan-Study Abroad": "IPSA",
  Portuguese: "PORT",
  "Professional Practice": "DOPP",
  "Lit, Communication & Culture": "LCC",
  "Health Performance Science": "HPS",
  "Philosophy of Science/Tech": "PST",
  "Health Physics": "HP",
  "Regents' Reading Skills": "RGTR",
  "Regents' Writing Skills": "RGTE",
  "Chemical Engineering": "CHE",
  "Textile & Fiber Engineering": "TFE",
  "Textile Engineering": "TEX",
  "Management Science": "MSCI",
  "Materials Engineering": "MATE",
  "Civil Engineering": "CE",
  "Electrical Engineering": "EE",
  "Computer Engineering": "CMPE",
  "Military Science": "MS",
  "Nuclear Engineering": "NE",
  "Physical Education": "PE",
  "Engineering Graphics": "EGR",
  "Engr Science and Mechanics": "ESM",
  "Technology & Science Policy": "TASP",
  "Foreign Language": "FL",
  "Studies Abroad": "SA",
};
const courseMap = new Map(Object.entries(fullCourseNames));

// Header's indices in prereq HTML table
const Headers = {
  Operator: 0,
  OParen: 1,
  Test: 2,
  Score: 3,
  Subject: 4,
  CourseNumber: 5,
  Level: 6,
  Grade: 7,
  CParen: 8,
};

/**
 * Converts prerequisites in HTML table format to Banner 8's string format
 * but without semester level.
 * @param html - Source HTML for the page
 * @returns prereq string (e.g., "MATH 8305 Minimum Grade of D")
 *
 * NOTE: When a course name is missing from fullCourseNames map above,
 * the course is removed from the prerequisite list and a warning is logged.
 */
function prereqHTMLToString(html: string, courseId: string) {
  const $ = load(html);
  const prereqTable = $(".basePreqTable").find("tr");
  const prereqs = Array<string>();

  prereqTable.each((rowIndex, element) => {
    if (rowIndex === 0) return;

    const prereqRow = $(element).children();
    let prereq = "";

    let subjectCode: string | undefined;

    prereqRow.each((colIndex: number): void => {
      if (colIndex === Headers.Level) return;
      let value = prereqRow.eq(colIndex).text();

      if (value.length === 0) return;
      if (colIndex === Headers.Operator) value = value.toLowerCase();
      if (colIndex === Headers.Subject) {
        subjectCode = courseMap.get(value);
        if (!subjectCode) {
          warn(
            `Course has a prereq for ${value} whose abbreviation does not exist. Prereq skipped.`,
            {
              courseId,
              subject: value,
            }
          );
          return;
        }
        value = subjectCode;
      }

      // ignore course if course abbreviation not found
      if (
        (colIndex === Headers.CourseNumber || colIndex === Headers.Grade) &&
        !subjectCode
      )
        return;

      if (colIndex === Headers.Grade) value = `Minimum Grade of ${value}`;

      prereq += value;

      if (colIndex !== Headers.OParen && colIndex !== Headers.CParen)
        prereq += " ";
    });

    prereqs.push(prereq);
  });

  // Concatenate all prereqs and remove empty parantheses
  return prereqs.join("").trim();
}

/**
 * Parses the HTML of a single course to get its prerequisites
 * @param html - Source HTML for the page
 * @param courseId - The joined course id (SUBJECT NUMBER); i.e. `"CS 2340"`
 */
export function parseCoursePrereqs(
  html: string,
  courseId: string
): Prerequisites {
  // Converts prereqs in HTML table form to Banner 8 (old Oscar system that crawler-v1 uses)'s string format
  const prereqString = prereqHTMLToString(html, courseId);

  // Create the lexer and parser using the ANTLR 4 grammar defined in ./grammar
  // (using antlr4ts: https://github.com/tunnelvisionlabs/antlr4ts)
  const charStream = CharStreams.fromString(prereqString, courseId);
  const lexer = new PrerequisitesLexer(charStream);
  lexer.removeErrorListeners();
  lexer.addErrorListener(new ErrorListener(courseId, prereqString));
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new PrerequisitesParser(tokenStream);
  parser.removeErrorListeners();
  parser.addErrorListener(new ErrorListener(courseId, prereqString));

  // Get the top-level "parse" rule's tree
  // and pass it into our visitor to transform the parse tree
  // into the prefix-notation parsed version
  const tree = parser.parse();
  const visitor = new PrefixNotationVisitor();
  const prerequisiteClause = visitor.visit(tree);

  // No prerequisites
  if (prerequisiteClause == null) {
    return [];
  }

  // If there is only a single prereq, return as a prefix set with "and"
  if (isSingleCourse(prerequisiteClause)) {
    return ["and", prerequisiteClause];
  }

  // Finally, flatten the tree so that consecutive operands
  // for the same operator in a series of nested PrerequisiteSets
  // are put into a single PrerequisiteSet
  const flattened = flatten(prerequisiteClause);
  return flattened;
}

/**
 * Type guard to determine if a clause is a single course
 * @param clause - source clause (either single course or prereq set)
 */
function isSingleCourse(
  clause: PrerequisiteClause
): clause is PrerequisiteCourse {
  return typeof clause === "object" && !Array.isArray(clause);
}

/**
 * Type guard to determine if a clause is a null prerequisite set
 * @param clause - source clause (either single course or prereq set)
 */
function isNullSet(
  clause: PrerequisiteClause
): clause is [operator: PrerequisiteOperator] {
  return (
    typeof clause === "object" && Array.isArray(clause) && clause.length === 1
  );
}

/**
 * Flattens a prerequisite tree so that:
 * - singular `PrerequisiteSet`s like `['and', 'CS 2340 (C)']`
 *   get turned into their string version (`'CS 2340 (C)'`)
 * - consecutive operands
 *   for the same operator in a series of nested `PrerequisiteSet`s
 *   are put into a single `PrerequisiteSet`
 * - null set PrerequisiteSet`s like `['and']` get removed
 * @param source - Source prerequisites tree using prefix boolean operators
 */
function flatten(source: PrerequisiteSet): PrerequisiteSet {
  function flattenInner(clause: PrerequisiteClause): PrerequisiteClause {
    // If the clause is a single course, nothing can be done to flatten
    if (isSingleCourse(clause)) return clause;

    const [operator, ...children] = clause;

    // Check for singular `PrerequisiteSet`s
    if (children.length === 1) {
      return flattenInner(children[0]);
    }

    // Check for nested `PrerequisiteSet`s that have the same operator
    const newChildren = [];
    for (const child of children) {
      const flattened = flattenInner(child);
      if (!isNullSet(flattened)) {
        // If the child is an array and has the same operator,
        // append its children to the current children array
        if (
          typeof flattened === "object" &&
          Array.isArray(flattened) &&
          flattened[0] === operator
        ) {
          newChildren.push(...flattened.slice(1));
        } else {
          // Otherwise, just add the child
          newChildren.push(flattened);
        }
      }
    }

    return [operator, ...children.map(flattenInner)];
  }

  // Call the recursive traversal function on the root node's children
  const [operator, ...children] = source;
  const transformedChildren = children
    .map(flattenInner)
    .filter((c) => !isNullSet(c));
  return [operator, ...transformedChildren];
}

/**
 * Custom error listener class that lets us prepend the course ID
 * onto parsing errors so that they can be easier identified from logs
 */
class ErrorListener implements ANTLRErrorListener<unknown> {
  courseId: string;

  original: string;

  constructor(courseId: string, original: string) {
    this.courseId = courseId;
    this.original = original;
  }

  public syntaxError<T>(
    _recognizer: Recognizer<T, ATNSimulator>,
    _offendingSymbol: T,
    line: number,
    charPositionInLine: number,
    msg: string
  ): void {
    error("an error occurred while parsing prerequisites", new Error(msg), {
      line,
      charPositionInLine,
      courseId: this.courseId,
      originalTextFromOscar: this.original,
    });
  }
}

// Defines the class used to flatten the parse tree
// into the prefix-notation parsed version
class PrefixNotationVisitor
  extends AbstractParseTreeVisitor<PrerequisiteClause>
  implements PrerequisitesVisitor<PrerequisiteClause>
{
  defaultResult(): PrerequisiteClause {
    return null as unknown as PrerequisiteClause;
  }

  // Expression: logical disjunction (OR)
  visitExpression(ctx: ExpressionContext): PrerequisiteClause {
    // Create the `PrerequisiteSet` using each child
    return [
      "or",
      ...ctx
        .term()
        .map((termCtx) => this.visit(termCtx))
        .filter((term) => term != null),
    ];
  }

  // Term: logical conjunction (AND)
  visitTerm(ctx: TermContext): PrerequisiteClause {
    // Create the `PrerequisiteSet` using each child
    return [
      "and",
      ...ctx
        .atom()
        .map((atomCtx) => this.visit(atomCtx))
        .filter((term) => term != null),
    ];
  }

  visitAtom(ctx: AtomContext): PrerequisiteClause {
    // Visit either the course or the expression inside the parentheses
    const course = ctx.course();
    const expression = ctx.expression();
    const test = ctx.test();

    if (course != null) {
      return this.visit(course);
    }
    if (expression != null) {
      return this.visit(expression);
    }
    if (test != null) {
      // Note: we ignore test atoms at the moment,
      // though this can be easily changed in the future
      return this.defaultResult();
    }

    throw new Error("Empty Atom received");
  }

  visitCourse(ctx: CourseContext): PrerequisiteClause {
    // Construct the base string for this course
    // using the format expected by the API
    const subject = ctx.COURSE_SUBJECT().toString();
    const number = ctx.COURSE_NUMBER().toString();

    // There might not be a grade
    let grade: MinimumGrade | undefined;
    const gradeCtx = ctx.GRADE_LETTER();
    if (gradeCtx != null) {
      grade = gradeCtx.toString() as MinimumGrade;
    }

    return { id: `${subject} ${number}`, grade };
  }
}
