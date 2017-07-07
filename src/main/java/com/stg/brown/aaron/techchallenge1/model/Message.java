package com.stg.brown.aaron.techchallenge1.model;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Message implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	private Long sender;
	
	private Long receiver;
	
	private String body;

	@SuppressWarnings("unused")
	private Message() {
		super();
	}

	public Message(Long sender, Long receiver, String body) {
		super();
		this.sender = sender;
		this.receiver = receiver;
		this.body = body;
	}

	public Long getId() {
		return id;
	}

	public Long getSender() {
		return sender;
	}

	public void setSender(Long sender) {
		this.sender = sender;
	}

	public Long getReceiver() {
		return receiver;
	}

	public void setReceiver(Long receiver) {
		this.receiver = receiver;
	}

	public String getBody() {
		return body;
	}

	public void setBody(String body) {
		this.body = body;
	}
	
}
