package com.stg.brown.aaron.techchallenge1.repository;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import com.stg.brown.aaron.techchallenge1.model.Message;
import com.stg.brown.aaron.techchallenge1.model.User;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureDataJpa
@AutoConfigureTestDatabase
@AutoConfigureTestEntityManager
@WebAppConfiguration
public class UserRepositoryTest {

	private MockMvc mockMvc;

	@Autowired
	private WebApplicationContext webApplicationContext;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private MessageRepository messageRepository;

	private User alice;

	private User bob;
	
	private Message helloThere;

	@Before
	public void setup() {
		this.mockMvc = webAppContextSetup(webApplicationContext).build();

		this.messageRepository.deleteAll();
		this.userRepository.deleteAll();

		this.alice = this.userRepository.save(new User("Alice"));
		this.bob = this.userRepository.save(new User("Bob"));

		this.helloThere = this.messageRepository.save(new Message(alice.getId(), bob.getId(), "Hello there"));
	}

	@Test
	public void smokeTest() {
		assertThat(userRepository, notNullValue());
	}

	@Test
	public void findUsers() throws Exception {
		mockMvc.perform(get("/api/users")).andExpect(status().isOk()).andExpect(jsonPath("$._embedded.users", hasSize(2)));
	}

	@Test
	public void findUserAlice() throws Exception {
		mockMvc.perform(get("/api/users/" + this.alice.getId())).andExpect(status().isOk())
				.andExpect(jsonPath("$.name", is("Alice")));
	}

	@Test
	public void createUserCharlie() throws Exception {
		mockMvc.perform(post("/api/users").contentType(MediaType.APPLICATION_JSON_UTF8).content("{\"name\": \"Charlie\"}"))
				.andExpect(status().isCreated()).andExpect(header().string("location", notNullValue()));
	}

	@Test
	public void updateUser() throws Exception {
		mockMvc.perform(put("/api/users/" + this.bob.getId()).contentType(MediaType.APPLICATION_JSON_UTF8)
				.content("{\"name\": \"Rob\", \"id\": " + this.bob.getId() + "}")).andExpect(status().isNoContent())
				.andExpect(header().string("location", notNullValue()));
	}

	@Test
	public void deleteUser() throws Exception {
		this.messageRepository.delete(this.helloThere);
		
		mockMvc.perform(delete("/api/users/" + this.bob.getId())).andExpect(status().isNoContent())
				.andExpect(header().string("location", nullValue()));
	}

	@Test
	public void getMessages() throws Exception {
		mockMvc.perform(get("/api/users/" + this.bob.getId() + "/messages")).andExpect(status().isOk())
				.andExpect(jsonPath("$._embedded.messages", hasSize(1)))
				.andExpect(jsonPath("$._embedded.messages[0].body", is("Hello there")));
	}
}
