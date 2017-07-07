package com.stg.brown.aaron.techchallenge1.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.stg.brown.aaron.techchallenge1.model.Message;

@RepositoryRestResource(collectionResourceRel = "messages", path = "messages")
public interface MessageRepository extends PagingAndSortingRepository<Message, Long> {
	Page<Message> findByReceiver(@Param("id") Long receiver, Pageable pageable);
}
