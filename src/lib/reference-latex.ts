export const REFERENCE_LATEX = String.raw`
\fontsize{9}{10}\selectfont

\noindent
{\Huge \textbf{John Doe}}

\vspace{6pt}
\noindent
\begin{tabular*}{\textwidth}{l@{\extracolsep{\fill}}r}
  B.S. in Computer Science at Example University, CA & Mobile: +1 1234567890 \\
  Email: \href{mailto:johndoe@example.com}{johndoe@example.com} & 
\href{https://example.com/}{\textcolor{linkblue}{Portfolio}} $|$ 
\href{https://www.linkedin.com/in/johndoe/}{\textcolor{linkblue}{LinkedIn}} $|$ 
\href{https://github.com/johndoe}{\textcolor{linkblue}{GitHub}}
\end{tabular*}

\section{Education}
\begin{itemize}
  \item \textbf{Master of Science - Computer Science} \hfill Sep 2024 – Mar 2026\\
  \textbf{Example University, Default City, USA}, 
  Grade: 4.0 \\
  Courses: CS 101 Intro to Algorithms, CS 102 Data Structures \\
  \vspace{-10pt}
  \item 
  \textbf{B.S. - Computer Science} \hfill Jul 2020 – May 2024\\
  \textbf{National Example Institute of Technology, AC}\\
\end{itemize}

 \vspace{-10pt}
\section{Experience}
 \vspace{-6pt}

\resumeSubheadingWithDetail{Software Engineer}{Example City, USA}
{Example Tech LLC}{Jan 2024 – Present}
\resumeItemListStart
    \resumeItemWithoutTitle{Developed scalable web applications resulting in a \textbf{20\% performance improvement} across core services.}
    \resumeItemWithoutTitle{Collaborated with cross-functional teams to securely manage cloud infrastructure and optimize database queries.}
\resumeItemListEnd

\resumeSubheadingWithDetail{Data Analyst Intern}{Remote}
{Analytics Corp}{May 2023 – Dec 2023}
\resumeItemListStart
    \resumeItemWithoutTitle{Designed automated dashboards using Tableau, increasing internal visibility into daily sales metrics by \textbf{35\%}.}
\resumeItemListEnd

\section{Projects}
\resumeSubHeadingListStart
\item \textbf{Template AI App (React, Python)}
\begin{itemize}[noitemsep,topsep=0pt,leftmargin=*]
  \resumeItemWithoutTitle{Built an AI-powered interactive dashboard utilizing OpenAI's API to summarize large textual documents.}
  \resumeItemWithoutTitle{Implemented a Retrieval-Augmented Generation (RAG) pipeline to reduce hallucinations by \textbf{40\%}.}
\end{itemize}
\resumeSubHeadingListEnd

\section{Skills Summary}
\resumeSubHeadingListStart
\item \textbf{Languages \& Frameworks:} Python, JavaScript, TypeScript, React, Next.js, Node.js
\item \textbf{Database \& Cloud:} PostgreSQL, MongoDB, AWS (EC2, S3), Docker
\resumeSubHeadingListEnd
`;
