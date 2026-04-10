export const REFERENCE_LATEX = String.raw`
\fontsize{9}{10}\selectfont

\noindent
{\Huge \textbf{Niteesh Kumar Soundra Pandian}}

\vspace{6pt}
\noindent
\begin{tabular*}{\textwidth}{l@{\extracolsep{\fill}}r}
  MS in Data Science at University of Washington, Seattle & Mobile: +1 2065795098 \\
  Email: \href{mailto:nksp2@uw.edu}{nksp2@uw.edu} & 
\href{https://niteeshkcl-create.github.io/niteesh.github.io/}{\textcolor{linkblue}{Portfolio}} $|$ 
\href{https://www.linkedin.com/in/niteesh-kumar-s/}{\textcolor{linkblue}{LinkedIn}} $|$ 
\href{https://github.com/niteeshkcl-create}{\textcolor{linkblue}{GitHub}}
\end{tabular*}

\section{Education}
\begin{itemize}
  \item \textbf{Master of Science - Data Science} \hfill Sep 2025 – Mar 2027\\
  \textbf{University of Washington, Seattle, USA}, 
  Grade: 3.85 \\
  Courses: CSE 517 NLP, DATA 556 Intro to Stat \& Prob, DATA 557 Applied Statistics and Experimental Design \\
  \vspace{-10pt}
  \item 
  \textbf{B.Tech - Instrumentation \& Control(Major), Computer Science(Minor)} \hfill Jul 2018 – May 2022\\
  \textbf{National Institute of Technology, Tiruchirappalli, India}\\
\end{itemize}

 \vspace{-10pt}
\section{Experience}
 \vspace{-6pt}

\resumeSubheadingWithDetail{Applied Scientist Consultant}{Seattle, USA}
{Woods Coffee | Data Science Society at UW}{Jan 2026 – Present}
\resumeItemListStart
    \resumeItemWithoutTitle{Conducting a \textbf{quantitative analysis of existing portfolios} utilizing \textbf{causal inference} and correlation to identify \textbf{revenue drivers} and determine the impact of demographic factors on asset performance.}
    \resumeItemWithoutTitle{Developing multivariate statistical models to maximize profitability and support \textbf{investment decisions} for future site selections.}
\resumeItemListEnd

\resumeSubheadingWithDetail{Teaching Assistant}{Seattle, USA}
{Foster School of Business, University of Washington}{Sep 2025 – Dec 2025}
\resumeItemListStart
\resumeItemWithoutTitle{Leading technical instruction and mentoring \textbf{40+ students} in \textbf{MKTG 466: Digital Marketing Analytics} on applying \textbf{statistical modeling}, \textbf{predictive analytics}, and \textbf{Tableau-based dashboarding} for marketing optimization.}
\resumeItemListEnd

\resumeSubheadingWithDetail{Data Scientist – l}{Bengaluru, India}
{TATA CLiQ E-commerce (Full-time)}{Jul 2022 – Aug 2025}
\resumeItemListStart
    \resumeItemWithoutTitle{Implemented an \textbf{ALBERT-based Multi-Task Query Parser} for search category and intent prediction; achieved a \textbf{2\% lift in average CTR} and boosted \textbf{precision from 57\% to 71\%} using Dropout Regularization and noise filtering.}
    \resumeItemWithoutTitle{Developed a \textbf{CatBoost-based RTO risk model} using behavioral, logistics, and seller-level features. Collaborated with product and operations teams on thresholding and workflow integration, \textbf{reducing fraudulent return-to-origin by 4\%}.}
    \resumeItemWithoutTitle{Designed a \textbf{lightweight relevance scoring layer} which improved ranking and delivered a \textbf{2\% CTR gain} by combining engagement-driven features across \textbf{1.2M SKUs}, with an integrated \textbf{business-led boosting system} for priority products.}
    \resumeItemWithoutTitle{Improved \textbf{Wishlist Recovery} by implementing a \textbf{hybrid similarity model} that combined BERT-based product embeddings with user-item signals to recommend substitutes for unavailable items, increasing interaction rates from \textbf{7\%} to \textbf{15\%}.}
    \resumeItemWithoutTitle{\textbf{Fine-tuned} an \textbf{XGBoostRanker} for \textbf{Search Listing Page ranking} by using updated session-item features; validated via \textbf{A/B testing}(\textbf{95\%} statistical significance), delivering an \textbf{NDCG@40 gain} from \textbf{0.76} to \textbf{0.84} and mitigating data drift.}
    \resumeItemWithoutTitle{Boosted \textbf{CRM personalization} by generating customer–brand affinity vectors using \textbf{prod2vec-style sequence embeddings} using browse and purchase data, and integrating into targeting workflows; lifting interaction rates from \textbf{18\%} to \textbf{27\%}.}
    \resumeItemWithoutTitle{Built a low-latency \textbf{autosuggestion ranker} via \textbf{SageMaker endpoints} which improved \textbf{engagement by 3\%} using \textbf{Gradient-Boosted Trees} with recency, popularity, and behavior data, with a \textbf{seasonal query-boosting mechanism}.}
\resumeItemListEnd

\resumeSubheadingWithDetail{DL Research Intern}{Tiruchirapalli, India}
{National Institute of Technology, Tiruchirapalli, India}{Jan 2022 – Jun 2022}
\resumeItemListStart
    \resumeItemWithoutTitle{Developed an \textbf{Xception-based CNN} for \textbf{orthopedic injury detection} using \textbf{160K images} and addressing class imbalance, achieving \textbf{86\% accuracy} and integrating predictions into an \textbf{SMA-actuated prototype} for rehabilitation feedback.}
\resumeItemListEnd

\section{Projects}
\resumeSubHeadingListStart
\item \textbf{Self-Training Based Document-Level NMT (English–Tamil)}
\begin{itemize}[noitemsep,topsep=0pt,leftmargin=*]
  \resumeItemWithoutTitle{Implemented a document-level English→Tamil NMT system by extending MarianMT with context windows, \textbf{sentence-level back-translation}, and \textbf{self-training} on unlabeled corpora, improving \textbf{BLEU score by +4.7\%} compared to the baseline.}
  \resumeItemWithoutTitle{Enhanced models with \textbf{BERTScore-based semantic loss}, \textbf{context-aware fine-tuning}, and \textbf{progressive adaptation (MMT + FT + HL + Span)}, delivering gains in BLEU, semantic fidelity, discourse coherence, and translation stability.}
\end{itemize}

\item \textbf{MoLoRAG: Multi-modal Logic-aware RAG (Qwen2.5-VL, LoRA, PyTorch)}
\begin{itemize}[noitemsep,topsep=0pt,leftmargin=*]
    \resumeItemWithoutTitle{Developed a high-performance retrieval system for long-form multi-modal documents, implementing a \textbf{hierarchical graph-based traversal} to maintain logical coherence across text and images.}
    \resumeItemWithoutTitle{Fine-tuned a \textbf{Vision-Language Model (Qwen2.5-VL-3B)} using \textbf{LoRA} and \textbf{PEFT} for logical relevance scoring, addressing complex reasoning gaps in standard RAG pipelines.}
    \resumeItemWithoutTitle{Engineered a scalable preprocessing pipeline for \textbf{MMLongBench} and \textbf{LongDocURL} datasets, utilizing \textbf{CLIP-based embeddings} and \textbf{bitsandbytes} for memory-efficient 4-bit quantization during inference.}
    \resumeItemWithoutTitle{Evaluated system performance using a custom suite, benchmarking \textbf{top-k retrieval accuracy} and semantic fidelity against industry baselines like M3DocRAG.}
\end{itemize}
\resumeSubHeadingListEnd

\section{Skills Summary}
\resumeSubHeadingListStart
\item \textbf{AI \& Agentic Frameworks:} \textbf{Agentic AI Workflows}, \textbf{LLM Orchestration}, \textbf{LangChain}, \textbf{LlamaIndex}, \textbf{RAG Pipelines}, \textbf{Prompt Engineering}, Vector Databases (FAISS, Milvus), Evaluation \& Trust Loops.
\item \textbf{Deep Learning \& NLP:} \textbf{Transformers}, BERT, ALBERT, PyTorch, TensorFlow, Reinforcement Learning, Multi-Task Learning, \textbf{Causal Inference}, Statistical Modeling.
\item \textbf{Software Engineering \& Cloud:} \textbf{Python}, Go, SQL (Advanced), \textbf{AWS (SageMaker, S3, EC2, Lambda)}, \textbf{Snowflake}, Apache Spark, Airflow, MLflow, Docker, Kubernetes.
\resumeSubHeadingListEnd

\section{Publications}
\resumeSubHeadingListStart
\item \textbf{Uncertainty-aware Contextual Multi-armed Bandits for Recommendations in E-commerce}
\begin{itemize}[noitemsep, topsep=0pt, leftmargin=*]
    \item Published in \textit{IAES International Journal of Artificial Intelligence (IJ-AI)}, 2025. Proposed a contextual bandit-based approach incorporating uncertainty estimation to improve recommendation relevance in e-commerce.\href{https://www.researchgate.net/publication/392485072_Uncertainty-aware_contextual_multi-armed_bandits_for_recommendations_in_e-commerce}{View Publication on \underline{ResearchGate}.}
\end{itemize}
\resumeSubHeadingListEnd
`;
