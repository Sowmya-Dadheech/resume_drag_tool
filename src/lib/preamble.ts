export const DEFAULT_PREAMBLE = String.raw`
\documentclass[letterpaper,9pt]{extarticle}
\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[pdftex]{hyperref}
\usepackage{fancyhdr}
\usepackage{xcolor}
\usepackage{ragged2e}

\pagestyle{fancy}
\fancyhf{} 
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-0.5in}
\addtolength{\textheight}{1in}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}
\setlist[itemize]{topsep=0pt, partopsep=0pt, parsep=0pt, itemsep=1pt}

\urlstyle{rm}

\titleformat{\section}{
  \vspace{-13pt}
  \scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule 
\vspace{-5pt}
]

\newcommand{\resumeItem}[2]{\item \textbf{#1}: #2}
\newcommand{\resumeItemWithoutTitle}[1]{\item #1}

\newcommand{\resumeSubheading}[4]{
  \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{#3} & \textit{#4} \\
    \end{tabular*}
}

\newcommand{\resumeSubheadingWithDetail}[5]{
  \item
    \begin{tabular*}{\textwidth}{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{#3} & \textit{#4} \\
    \end{tabular*}
    #5
}

\renewcommand{\labelitemii}{$\circ$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=*]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}}

\definecolor{linkblue}{HTML}{0077B5}
\hypersetup{
    colorlinks=true,
    urlcolor=linkblue,
    hidelinks
}

\justifying
`;
