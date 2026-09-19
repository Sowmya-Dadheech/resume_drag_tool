export const DEFAULT_PREAMBLE = `
\\documentclass[letterpaper,9.5pt]{article}
\\usepackage{latexsym}
\\usepackage[left=0.35in,right=0.35in,top=0.35in,bottom=0.35in]{geometry}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[pdftex]{hyperref}
\\usepackage{fancyhdr}
\\usepackage{xcolor}
\\usepackage{ragged2e}

\\pagestyle{fancy}
\\fancyhf{} 
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% High density itemize spacing matching Niteesh's layout
\\setlist[itemize]{topsep=1.5pt, partopsep=0pt, parsep=0.5pt, itemsep=1.5pt, leftmargin=1.1em}

\\urlstyle{rm}

% Section formatting matching Niteesh's uppercase sections with titlerule
\\titleformat{\\section}{
  \\vspace{-5pt}
  \\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule 
\\vspace{-3pt}
]

\\newcommand{\\resumeItem}[2]{\\item \\textbf{#1}: #2}
\\newcommand{\\resumeItemWithoutTitle}[1]{\\item #1}

% Subheading formatting matching Niteesh's 2-line layout
\\newcommand{\\resumeSubheading}[4]{
  \\item
    \\begin{tabular*}{0.99\\textwidth}{l@{\\extracolsep{\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{#3} & \\textit{#4} \\\\
    \\end{tabular*}\\vspace{-4pt}
}

\\newcommand{\\resumeSubheadingWithDetail}[5]{
  \\item
    \\begin{tabular*}{0.99\\textwidth}{l@{\extracolsep{\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{#3} & \\textit{#4} \\\\
    \\end{tabular*}
    #5
    \\vspace{-4pt}
}

\\renewcommand{\\labelitemii}{$\\circ$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=*,label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}\\vspace{-3pt}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=1.1em]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-2pt}}

\\definecolor{linkblue}{HTML}{0077B5}
\\hypersetup{
    colorlinks=true,
    urlcolor=linkblue,
    hidelinks
}

\\justifying
`;
