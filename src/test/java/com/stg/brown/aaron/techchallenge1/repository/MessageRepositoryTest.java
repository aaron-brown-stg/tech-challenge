package com.stg.brown.aaron.techchallenge1.repository;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import com.stg.brown.aaron.techchallenge1.TechChallenge1ApplicationTests;
import com.stg.brown.aaron.techchallenge1.model.Message;
import com.stg.brown.aaron.techchallenge1.model.User;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.*;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureDataJpa
@AutoConfigureTestDatabase
@AutoConfigureTestEntityManager
@WebAppConfiguration
public class MessageRepositoryTest {

	private MockMvc mockMvc;

	@Autowired
	private WebApplicationContext webApplicationContext;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private MessageRepository messageRepository;

	private User alice;

	private User bob;

	private Message messageOne;

	private Message messageTwo;

	@Before
	public void setup() {
		this.mockMvc = webAppContextSetup(webApplicationContext).build();

		this.messageRepository.deleteAll();
		this.userRepository.deleteAll();

		this.alice = this.userRepository.save(new User("Alice"));
		this.bob = this.userRepository.save(new User("Bob"));

		this.messageOne = this.messageRepository.save(new Message(alice.getId(), bob.getId(), "Hello there"));
		this.messageTwo = this.messageRepository.save(new Message(bob.getId(), alice.getId(), "Hello back"));
	}

	@Test
	public void smokeTest() {
		assertThat(messageRepository, notNullValue());
	}

	@Test
	public void findMessages() throws Exception {
		mockMvc.perform(get("/api/messages")).andExpect(status().isOk())
				.andExpect(jsonPath("$._embedded.messages", hasSize(2)));
	}

	@Test
	public void findMessageOne() throws Exception {
		mockMvc.perform(get("/api/messages/" + this.messageOne.getId())).andExpect(status().isOk())
				.andExpect(jsonPath("$.body", is("Hello there")));
	}

	@Test
	public void createMessage() throws Exception {
		mockMvc.perform(post("/api/messages").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content("{\"body\": \"Hello World\", \"sender\": " + this.bob.getId() + ", \"receiver\": "
						+ this.alice.getId() + "}"))
				.andExpect(status().isCreated()).andExpect(header().string("location", notNullValue()));
	}

	@Test
	public void updateMessage() throws Exception {
		mockMvc.perform(put("/api/messages/" + this.messageTwo.getId()).contentType(MediaType.APPLICATION_JSON_UTF8)
				.content("{\"body\": \"Good bye\", \"id\": " + this.messageTwo.getId() + ", \"sender\": "
						+ this.bob.getId() + ", \"receiver\": " + this.alice.getId() + "}"))
				.andExpect(status().isNoContent()).andExpect(header().string("location", notNullValue()));
	}

	@Test
	public void deleteUser() throws Exception {
		mockMvc.perform(delete("/api/messages/" + this.messageTwo.getId())).andExpect(status().isNoContent())
				.andExpect(header().string("location", nullValue()));
	}
}
