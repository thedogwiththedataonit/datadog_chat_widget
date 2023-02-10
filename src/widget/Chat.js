import './Chat.css';
import { useState, useEffect, useRef } from 'react';
import DatadogIcon from "./img/datadog-logo.svg"
import UserIcon from "./img/datadog-products.svg"
import { site, port } from "../env.js"


function Chat() {
    const [messageList, setMessageList] = useState([])
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('')
    const [relatedQuestions, setRelatedQuestions] = useState([])
    const [responseLoading, setResponseLoading] = useState(false)
    
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();

    }, [messageList])

    async function openAISearch(question, prompt){
        const localUrl = `http://${site}:${port}/api/v1/openAISearch`;
        await fetch(localUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({question:question, prompt:prompt}),
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                //wait 5 seconds
                setResponseLoading(false)
                setMessageList(messageList => [...messageList, {"question":data.response, "status":false}])
                
                //messageList.push({"question":data.response, "status":false})//true for user, false for bits
                setResponse(data.response)
                const relatedQuestions = parseRelatedQuestions(data.related_questions)
                setRelatedQuestions(relatedQuestions)
                console.log(messageList)

            })

    }

    const parseRelatedQuestions = (string) => {
        //split by :
        const split = string.split(" -")
        //turn into array 
        let array = split.map((item) => {
            return item.trim()
        })
        array = array.filter((item) => {
            return item !== "" && item !== " "
        })
        return array
    }
    
    const handleMessageChange = event => {
        setMessage(event.target.value);
      };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if ((message === "") || (message === " ")) {
            return
        }
        setMessageList(messageList => [...messageList, {"question":message, "status":true}])
        //messageList.push({"question":message, "status":true}) //true for user, false for bits
        console.log(messageList)
        event.target.reset();
        setMessage("")
        setRelatedQuestions([])
        setResponse(false)
        setResponseLoading(true)
        handleResponse(message)

    }
    const handleSuggestions = (value) => {
        setMessageList(messageList => [...messageList, {"question":value, "status":true}])
        //messageList.push({"question":value, "status":true}) //true for user, false for bits
        setMessage("")
        setRelatedQuestions([])
        setResponseLoading(true)
        setResponse(false)
        handleResponse(value)
    }

    const handleResponse = (message) => {
        openAISearch(message, "") //prompt is null
    }
    
    return (<div className="questionbox">
                    <div className="chatbox">
                        <div className="chat-row-false">
                            <span>
                                <img src={DatadogIcon} alt="svg"></img>
                            </span>
                            <div className="chat-text-box">
                                <p>What are you curious about?</p>
                            </div>
                        </div>
                        {
                            messageList.map((text,i) => {
                                return (
                                    <div className={"chat-row-" + text.status} key={i}>
                                        {!text.status && (
                                            <span>
                                                <img src={DatadogIcon} alt="svg"></img>
                                            </span>
                                        )}
                                        <div className="chat-text-box">
                                            <p>{text.question}</p>
                                        </div>
                                        {text.status && (
                                            <span>
                                                <img src={UserIcon} alt="svg"></img>
                                            </span>
                                        )}
                                    </div>
                                    
                                )
                            })
                        }
                        {
                            responseLoading && (
                                <div className="chat-row-false">
                                    <span>
                                        <img src={DatadogIcon} alt="svg"></img>
                                    </span>
                                    <div className="chat-text-box">
                                        <p className="loader-dots">Fetching</p>
                                    </div>
                                </div>
                            )
                        }
                        <div ref={messagesEndRef}/>
                    </div>
                    <form className="textbox" onSubmit={handleSubmit}>
                        <textarea 
                            placeholder={""}
                            onChange={handleMessageChange}
                        ></textarea>
                        <button>Send</button>
                    </form>
                    {
                        response && (
                            <div className="suggested-questions">
                                {
                                    relatedQuestions.map((question, i) => {
                                        return (
                                            <div className="suggested-question" onClick={() => handleSuggestions(question)} key={i}>
                                                <p>{question}</p>
                                            </div>
                                        )
                                    }
                                    )
                                }
                            </div>
                        )
                    }
                </div>)
}

export default Chat;