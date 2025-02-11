--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-02-11 06:57:06

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 19139)
-- Name: game_session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_session (
    id integer NOT NULL,
    score integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer
);


ALTER TABLE public.game_session OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 19137)
-- Name: game_session_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.game_session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.game_session_id_seq OWNER TO postgres;

--
-- TOC entry 4913 (class 0 OID 0)
-- Dependencies: 217
-- Name: game_session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.game_session_id_seq OWNED BY public.game_session.id;


--
-- TOC entry 220 (class 1259 OID 19152)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    "highScore" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 19150)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO postgres;

--
-- TOC entry 4914 (class 0 OID 0)
-- Dependencies: 219
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 4747 (class 2604 OID 19143)
-- Name: game_session id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_session ALTER COLUMN id SET DEFAULT nextval('public.game_session_id_seq'::regclass);


--
-- TOC entry 4750 (class 2604 OID 19155)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 4905 (class 0 OID 19139)
-- Dependencies: 218
-- Data for Name: game_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.game_session (id, score, "createdAt", "userId") FROM stdin;
\.


--
-- TOC entry 4907 (class 0 OID 19152)
-- Dependencies: 220
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, username, password, "highScore") FROM stdin;
\.


--
-- TOC entry 4915 (class 0 OID 0)
-- Dependencies: 217
-- Name: game_session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.game_session_id_seq', 15, true);


--
-- TOC entry 4916 (class 0 OID 0)
-- Dependencies: 219
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 33, true);


--
-- TOC entry 4753 (class 2606 OID 19148)
-- Name: game_session PK_58b630233711ccafbb0b2a904fc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_session
    ADD CONSTRAINT "PK_58b630233711ccafbb0b2a904fc" PRIMARY KEY (id);


--
-- TOC entry 4755 (class 2606 OID 19160)
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- TOC entry 4757 (class 2606 OID 19162)
-- Name: user UQ_78a916df40e02a9deb1c4b75edb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username);


--
-- TOC entry 4758 (class 2606 OID 19163)
-- Name: game_session FK_c074b7b076a6324617e6286fc7d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_session
    ADD CONSTRAINT "FK_c074b7b076a6324617e6286fc7d" FOREIGN KEY ("userId") REFERENCES public."user"(id);


-- Completed on 2025-02-11 06:57:06

--
-- PostgreSQL database dump complete
--

